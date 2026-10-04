<?php
/**
 * Site header.
 *
 * @package Solar_Face
 */

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'solar-face' ); ?></a>

<header class="site-header" data-header>
	<nav class="nav container" aria-label="<?php esc_attr_e( 'Primary', 'solar-face' ); ?>">
		<?php solar_face_brand(); ?>

		<?php
		$solar_face_cta = sprintf(
			'<li class="nav-menu-cta"><a class="btn btn-primary" href="%s">%s</a></li>',
			esc_url( solar_face_section_url( 'contact' ) ),
			esc_html__( 'Get Free Consultation', 'solar-face' )
		);
		solar_face_menu( 'primary', '<ul id="%1$s" class="%2$s" data-menu>%3$s' . $solar_face_cta . '</ul>', 'nav-menu', 'nav-links' );
		?>

		<div class="nav-actions">
			<a class="btn btn-primary nav-cta" href="<?php echo esc_url( solar_face_section_url( 'contact' ) ); ?>"><?php esc_html_e( 'Get Free Consultation', 'solar-face' ); ?></a>
			<button class="menu-toggle" type="button" aria-controls="nav-menu" aria-expanded="false" data-menu-toggle>
				<i class="ph ph-list" aria-hidden="true"></i><span class="sr-only"><?php esc_html_e( 'Open menu', 'solar-face' ); ?></span>
			</button>
		</div>
	</nav>
</header>
