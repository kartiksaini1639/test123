<?php
/**
 * Quote requests and newsletter sign-ups.
 *
 * Every submission is saved as a private "Enquiry" in wp-admin (so nothing is lost
 * if email delivery fails) and emailed to the address set in the Customizer.
 *
 * @package Solar_Face
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Private post type that stores enquiries.
 */
function solar_face_register_enquiries() {
	register_post_type(
		'sf_enquiry',
		array(
			'labels'          => array(
				'name'          => __( 'Enquiries', 'solar-face' ),
				'singular_name' => __( 'Enquiry', 'solar-face' ),
				'all_items'     => __( 'All enquiries', 'solar-face' ),
				'edit_item'     => __( 'Enquiry', 'solar-face' ),
				'search_items'  => __( 'Search enquiries', 'solar-face' ),
				'not_found'     => __( 'No enquiries yet.', 'solar-face' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_position'   => 25,
			'menu_icon'       => 'dashicons-email-alt',
			'supports'        => array( 'title', 'editor' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
}
add_action( 'init', 'solar_face_register_enquiries' );

/**
 * Basic per-visitor rate limit: 6 submissions per 10 minutes.
 *
 * @return bool True when the visitor may submit.
 */
function solar_face_rate_ok() {
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key = 'sf_rate_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= 6 ) {
		return false;
	}
	set_transient( $key, $n + 1, 10 * MINUTE_IN_SECONDS );
	return true;
}

/**
 * Save an enquiry and email it.
 *
 * @param string               $title Enquiry title.
 * @param array<string,string> $rows  Label => value.
 * @param string               $reply Reply-to email, if any.
 * @return bool Whether it was saved.
 */
function solar_face_store_enquiry( $title, $rows, $reply = '' ) {
	$lines = array();
	foreach ( $rows as $label => $value ) {
		if ( '' !== $value ) {
			$lines[] = $label . ': ' . $value;
		}
	}
	$body = implode( "\n", $lines );

	$post_id = wp_insert_post(
		array(
			'post_type'    => 'sf_enquiry',
			'post_status'  => 'private',
			'post_title'   => $title,
			'post_content' => $body, // Fields are already stripped of tags by the sanitizers.
		),
		true
	);

	$to      = solar_face_mod( 'lead_email' ) ? solar_face_mod( 'lead_email' ) : get_option( 'admin_email' );
	$headers = $reply ? array( 'Reply-To: ' . $reply ) : array();
	wp_mail( $to, '[' . wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . '] ' . $title, $body, $headers );

	return ! is_wp_error( $post_id );
}

/**
 * Read and clean a POST field.
 *
 * @param string $key Field name.
 * @return string
 */
function solar_face_field( $key ) {
	// Nonce is verified by the callers before this is used.
	return isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing
}

/**
 * AJAX: quote request.
 */
function solar_face_handle_lead() {
	check_ajax_referer( 'solar_face_lead', 'sf_nonce' );

	if ( '' !== solar_face_field( 'website' ) ) {
		wp_send_json_success(); // Honeypot filled: silently accept and drop.
	}
	if ( ! solar_face_rate_ok() ) {
		wp_send_json_error( array( 'message' => 'rate' ), 429 );
	}

	$name  = solar_face_field( 'name' );
	$phone = solar_face_digits( solar_face_field( 'phone' ) );
	$email = sanitize_email( solar_face_field( 'email' ) );
	$raw   = solar_face_field( 'email' );

	$errors = array();
	if ( mb_strlen( $name ) < 2 ) {
		$errors[] = 'name';
	}
	if ( ! preg_match( '/^[6-9]\d{9}$/', $phone ) ) {
		$errors[] = 'phone';
	}
	if ( '' !== $raw && ! is_email( $email ) ) {
		$errors[] = 'email';
	}
	if ( $errors ) {
		wp_send_json_error( array( 'fields' => $errors ), 422 );
	}

	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	$saved = solar_face_store_enquiry(
		/* translators: %s: customer name. */
		sprintf( __( 'Quote request from %s', 'solar-face' ), $name ),
		array(
			__( 'Name', 'solar-face' )                  => $name,
			__( 'Phone', 'solar-face' )                 => '+91 ' . $phone,
			__( 'Email', 'solar-face' )                 => $email,
			__( 'City / State', 'solar-face' )          => solar_face_field( 'city' ),
			__( 'Requirement', 'solar-face' )           => solar_face_field( 'type' ),
			__( 'Check subsidy eligibility', 'solar-face' ) => 'yes' === solar_face_field( 'subsidy' ) ? __( 'Yes', 'solar-face' ) : __( 'No', 'solar-face' ),
			__( 'Message', 'solar-face' )               => $message,
		),
		$email
	);

	$saved ? wp_send_json_success() : wp_send_json_error( array( 'message' => 'save' ), 500 );
}
add_action( 'wp_ajax_solar_face_lead', 'solar_face_handle_lead' );
add_action( 'wp_ajax_nopriv_solar_face_lead', 'solar_face_handle_lead' );

/**
 * AJAX: newsletter sign-up.
 */
function solar_face_handle_subscribe() {
	check_ajax_referer( 'solar_face_subscribe', 'sf_nonce' );

	if ( '' !== solar_face_field( 'website' ) ) {
		wp_send_json_success();
	}
	if ( ! solar_face_rate_ok() ) {
		wp_send_json_error( array( 'message' => 'rate' ), 429 );
	}

	$email = sanitize_email( solar_face_field( 'email' ) );
	if ( ! is_email( $email ) ) {
		wp_send_json_error( array( 'fields' => array( 'email' ) ), 422 );
	}

	$saved = solar_face_store_enquiry(
		/* translators: %s: email address. */
		sprintf( __( 'Newsletter sign-up: %s', 'solar-face' ), $email ),
		array( __( 'Email', 'solar-face' ) => $email ),
		$email
	);

	$saved ? wp_send_json_success() : wp_send_json_error( array( 'message' => 'save' ), 500 );
}
add_action( 'wp_ajax_solar_face_subscribe', 'solar_face_handle_subscribe' );
add_action( 'wp_ajax_nopriv_solar_face_subscribe', 'solar_face_handle_subscribe' );
