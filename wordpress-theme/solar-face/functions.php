<?php
/**
 * Solar Face theme setup.
 *
 * @package Solar_Face
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SOLAR_FACE_VERSION', '1.0.0' );

require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/leads.php';

/**
 * Theme supports and menus.
 */
function solar_face_setup() {
	load_theme_textdomain( 'solar-face', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 64,
			'width'       => 64,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Header menu', 'solar-face' ),
			'footer'  => __( 'Footer quick links', 'solar-face' ),
		)
	);
}
add_action( 'after_setup_theme', 'solar_face_setup' );

/**
 * Styles and scripts.
 */
function solar_face_assets() {
	$uri = get_template_directory_uri();

	wp_enqueue_style( 'solar-face-icons', $uri . '/assets/icons/phosphor.css', array(), SOLAR_FACE_VERSION );
	wp_enqueue_style( 'solar-face', $uri . '/assets/css/main.css', array( 'solar-face-icons' ), SOLAR_FACE_VERSION );

	wp_enqueue_script(
		'solar-face',
		$uri . '/assets/js/main.js',
		array(),
		SOLAR_FACE_VERSION,
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);

	wp_localize_script(
		'solar-face',
		'solarFace',
		array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'phone'   => solar_face_mod( 'phone' ),
			'i18n'    => array(
				'leadOk'     => __( 'Thank you. Our solar expert will call you back shortly.', 'solar-face' ),
				/* translators: %s: phone number. */
				'leadFail'   => __( 'Something went wrong. Please call us at %s.', 'solar-face' ),
				'subOk'      => __( 'You are subscribed. Thank you!', 'solar-face' ),
				'subFail'    => __( 'Could not subscribe right now. Please try again later.', 'solar-face' ),
				'subInvalid' => __( 'Please enter a valid email address.', 'solar-face' ),
				'menuOpen'   => __( 'Open menu', 'solar-face' ),
				'menuClose'  => __( 'Close menu', 'solar-face' ),
			),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'solar_face_assets' );

/**
 * Preload the main font so headings render without a visible swap.
 */
function solar_face_preload_font() {
	printf(
		'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
		esc_url( get_template_directory_uri() . '/assets/fonts/geist-latin-wght-normal.woff2' )
	);
}
add_action( 'wp_head', 'solar_face_preload_font', 1 );

/**
 * Digits-only version of a phone number for tel: and wa.me links.
 *
 * @param string $phone Phone number as typed.
 * @return string
 */
function solar_face_digits( $phone ) {
	return preg_replace( '/\D+/', '', (string) $phone );
}

/**
 * Link to a section of the one-page front page, from any page of the site.
 *
 * @param string $id Section id.
 * @return string
 */
function solar_face_section_url( $id ) {
	return is_front_page() ? '#' . $id : home_url( '/#' . $id );
}

/**
 * Default header and footer links, used until a menu is assigned.
 *
 * @param string $location Menu location.
 * @return array<string, string> Section id => label.
 */
function solar_face_default_links( $location ) {
	if ( 'footer' === $location ) {
		return array(
			'features' => __( 'Features', 'solar-face' ),
			'process'  => __( 'How It Works', 'solar-face' ),
			'pricing'  => __( 'Pricing', 'solar-face' ),
			'reviews'  => __( 'Reviews', 'solar-face' ),
			'faq'      => __( 'FAQ', 'solar-face' ),
		);
	}
	return array(
		'home'    => __( 'Home', 'solar-face' ),
		'schemes' => __( 'Govt Schemes', 'solar-face' ),
		'process' => __( 'Process', 'solar-face' ),
		'pricing' => __( 'Pricing', 'solar-face' ),
		'reviews' => __( 'Reviews', 'solar-face' ),
		'faq'     => __( 'FAQ', 'solar-face' ),
		'contact' => __( 'Contact', 'solar-face' ),
	);
}

/**
 * Print a menu location, falling back to the default section links.
 *
 * @param string $location   Menu location.
 * @param string $items_wrap Wrapper markup in wp_nav_menu format.
 * @param string $menu_id    Id for the list.
 * @param string $menu_class Class for the list.
 */
function solar_face_menu( $location, $items_wrap, $menu_id = '', $menu_class = '' ) {
	if ( has_nav_menu( $location ) ) {
		wp_nav_menu(
			array(
				'theme_location' => $location,
				'container'      => false,
				'menu_id'        => $menu_id,
				'menu_class'     => $menu_class,
				'items_wrap'     => $items_wrap,
				'depth'          => 1,
			)
		);
		return;
	}

	$items = '';
	foreach ( solar_face_default_links( $location ) as $id => $label ) {
		$items .= sprintf( '<li><a href="%s">%s</a></li>', esc_url( solar_face_section_url( $id ) ), esc_html( $label ) );
	}
	// The wrapper is theme markup with escaped attributes; items are escaped above.
	echo sprintf( $items_wrap, esc_attr( $menu_id ), esc_attr( $menu_class ), $items ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

/**
 * Brand mark: the custom logo when set, otherwise the built-in mark and site name.
 */
function solar_face_brand() {
	if ( has_custom_logo() ) {
		the_custom_logo();
		return;
	}
	printf(
		'<a class="brand" href="%1$s" rel="home"><svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9"/><circle cx="16" cy="16" r="7"/><path d="M16 9v14"/></svg><span>%2$s</span></a>',
		esc_url( home_url( '/' ) ),
		esc_html( get_bloginfo( 'name' ) )
	);
}
