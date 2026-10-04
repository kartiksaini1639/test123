<?php
/**
 * Customizer options: business details, prices and images.
 *
 * @package Solar_Face
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * All theme options with their defaults, grouped by Customizer section.
 *
 * @return array<string, array{section: string, label: string, default: string, type: string}>
 */
function solar_face_options() {
	$img = 'https://images.unsplash.com/';
	return array(
		// Business details.
		'phone'          => array( 'section' => 'business', 'type' => 'text', 'label' => __( 'Phone number (shown on the site)', 'solar-face' ), 'default' => '+91 93559 21251' ),
		'whatsapp'       => array( 'section' => 'business', 'type' => 'text', 'label' => __( 'WhatsApp number, with country code', 'solar-face' ), 'default' => '+91 93559 21251' ),
		'email'          => array( 'section' => 'business', 'type' => 'email', 'label' => __( 'Public email address', 'solar-face' ), 'default' => 'info@solarface.in' ),
		'address'        => array( 'section' => 'business', 'type' => 'textarea', 'label' => __( 'Office address', 'solar-face' ), 'default' => '#42, Solar Tech Park, Indiranagar, Bengaluru, Karnataka 560038' ),
		'gstin'          => array( 'section' => 'business', 'type' => 'text', 'label' => __( 'GSTIN', 'solar-face' ), 'default' => '29ABCDE1234F1Z5' ),
		'lead_email'     => array( 'section' => 'business', 'type' => 'email', 'label' => __( 'Send quote requests to (leave blank for the site admin email)', 'solar-face' ), 'default' => '' ),
		'facebook'       => array( 'section' => 'business', 'type' => 'url', 'label' => __( 'Facebook page URL', 'solar-face' ), 'default' => '' ),
		'instagram'      => array( 'section' => 'business', 'type' => 'url', 'label' => __( 'Instagram URL', 'solar-face' ), 'default' => '' ),
		'linkedin'       => array( 'section' => 'business', 'type' => 'url', 'label' => __( 'LinkedIn URL', 'solar-face' ), 'default' => '' ),
		'x'              => array( 'section' => 'business', 'type' => 'url', 'label' => __( 'X (Twitter) URL', 'solar-face' ), 'default' => '' ),

		// Pricing.
		'price_3kw'      => array( 'section' => 'pricing', 'type' => 'text', 'label' => __( 'Residential 3kW starting price', 'solar-face' ), 'default' => '₹1,80,000' ),
		'price_5kw'      => array( 'section' => 'pricing', 'type' => 'text', 'label' => __( 'Residential 5kW starting price', 'solar-face' ), 'default' => '₹2,90,000' ),
		'price_10kw'     => array( 'section' => 'pricing', 'type' => 'text', 'label' => __( 'Commercial 10kW+ starting price', 'solar-face' ), 'default' => '₹5,50,000' ),
		'emi_from'       => array( 'section' => 'pricing', 'type' => 'text', 'label' => __( 'EMI starting from (per month)', 'solar-face' ), 'default' => '₹2,000' ),

		// Images.
		'img_hero'       => array( 'section' => 'images', 'type' => 'image', 'label' => __( 'Hero photo (wide)', 'solar-face' ), 'default' => $img . 'photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=2200&q=80' ),
		'img_climate'    => array( 'section' => 'images', 'type' => 'image', 'label' => __( '"Built for Indian Climate" photo', 'solar-face' ), 'default' => $img . 'photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80' ),
		'img_schemes_1'  => array( 'section' => 'images', 'type' => 'image', 'label' => __( 'Subsidy section, back photo (portrait)', 'solar-face' ), 'default' => $img . 'photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80' ),
		'img_schemes_2'  => array( 'section' => 'images', 'type' => 'image', 'label' => __( 'Subsidy section, front photo (square)', 'solar-face' ), 'default' => $img . 'photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80' ),
		'img_contact'    => array( 'section' => 'images', 'type' => 'image', 'label' => __( 'Quote form background photo', 'solar-face' ), 'default' => $img . 'photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2200&q=80' ),
	);
}

/**
 * Read a theme option, falling back to its default.
 *
 * @param string $key Option key without prefix.
 * @return string
 */
function solar_face_mod( $key ) {
	$options = solar_face_options();
	$default = isset( $options[ $key ] ) ? $options[ $key ]['default'] : '';
	$value   = get_theme_mod( 'solar_face_' . $key, $default );
	return '' === $value && 'image' === ( $options[ $key ]['type'] ?? '' ) ? $default : (string) $value;
}

/**
 * Register Customizer panel, sections and controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function solar_face_customize_register( $wp_customize ) {
	$wp_customize->add_panel(
		'solar_face',
		array(
			'title'    => __( 'Solar Face settings', 'solar-face' ),
			'priority' => 30,
		)
	);

	$sections = array(
		'business' => __( 'Business details', 'solar-face' ),
		'pricing'  => __( 'Pricing', 'solar-face' ),
		'images'   => __( 'Photos', 'solar-face' ),
	);
	foreach ( $sections as $id => $title ) {
		$wp_customize->add_section( 'solar_face_' . $id, array( 'title' => $title, 'panel' => 'solar_face' ) );
	}

	$sanitizers = array(
		'text'     => 'sanitize_text_field',
		'textarea' => 'sanitize_textarea_field',
		'email'    => 'sanitize_email',
		'url'      => 'esc_url_raw',
		'image'    => 'esc_url_raw',
	);

	foreach ( solar_face_options() as $key => $option ) {
		$setting = 'solar_face_' . $key;
		$wp_customize->add_setting(
			$setting,
			array(
				'default'           => $option['default'],
				'sanitize_callback' => $sanitizers[ $option['type'] ],
				'transport'         => 'refresh',
			)
		);

		$args = array(
			'label'   => $option['label'],
			'section' => 'solar_face_' . $option['section'],
		);
		if ( 'image' === $option['type'] ) {
			$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $setting, $args ) );
		} else {
			$wp_customize->add_control( $setting, $args + array( 'type' => $option['type'] ) );
		}
	}
}
add_action( 'customize_register', 'solar_face_customize_register' );
