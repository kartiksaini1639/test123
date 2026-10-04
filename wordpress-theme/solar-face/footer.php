<?php
/**
 * Site footer.
 *
 * @package Solar_Face
 */

$solar_face_phone   = solar_face_mod( 'phone' );
$solar_face_email   = solar_face_mod( 'email' );
$solar_face_socials = array(
	'facebook'  => array( 'ph-facebook-logo', __( 'Facebook', 'solar-face' ) ),
	'instagram' => array( 'ph-instagram-logo', __( 'Instagram', 'solar-face' ) ),
	'linkedin'  => array( 'ph-linkedin-logo', __( 'LinkedIn', 'solar-face' ) ),
	'x'         => array( 'ph-x-logo', __( 'X', 'solar-face' ) ),
);
?>
<footer class="footer">
	<div class="container footer-grid">
		<div class="footer-about">
			<p><?php esc_html_e( "India's trusted solar partner. We are committed to making solar energy accessible, affordable, and hassle-free for every Indian household and business.", 'solar-face' ); ?></p>
			<ul class="socials">
				<?php
				foreach ( $solar_face_socials as $solar_face_key => $solar_face_social ) :
					$solar_face_url = solar_face_mod( $solar_face_key );
					if ( ! $solar_face_url ) {
						continue;
					}
					?>
					<li><a href="<?php echo esc_url( $solar_face_url ); ?>" target="_blank" rel="noopener" aria-label="<?php echo esc_attr( $solar_face_social[1] ); ?>"><i class="ph <?php echo esc_attr( $solar_face_social[0] ); ?>" aria-hidden="true"></i></a></li>
				<?php endforeach; ?>
			</ul>
		</div>

		<nav aria-label="<?php esc_attr_e( 'Quick links', 'solar-face' ); ?>">
			<h2><?php esc_html_e( 'Quick Links', 'solar-face' ); ?></h2>
			<?php solar_face_menu( 'footer', '<ul id="%1$s" class="%2$s">%3$s</ul>' ); ?>
		</nav>

		<div>
			<h2><?php esc_html_e( 'Contact Us', 'solar-face' ); ?></h2>
			<ul class="footer-contact">
				<?php if ( solar_face_mod( 'address' ) ) : ?>
					<li><address><?php echo nl2br( esc_html( solar_face_mod( 'address' ) ) ); ?></address></li>
				<?php endif; ?>
				<?php if ( $solar_face_phone ) : ?>
					<li><a href="tel:+<?php echo esc_attr( solar_face_digits( $solar_face_phone ) ); ?>"><?php echo esc_html( $solar_face_phone ); ?></a></li>
				<?php endif; ?>
				<?php if ( $solar_face_email ) : ?>
					<li><a href="mailto:<?php echo esc_attr( antispambot( $solar_face_email ) ); ?>"><?php echo esc_html( antispambot( $solar_face_email ) ); ?></a></li>
				<?php endif; ?>
			</ul>
		</div>

		<div>
			<h2><?php esc_html_e( 'Stay Updated', 'solar-face' ); ?></h2>
			<p><?php esc_html_e( 'Subscribe for latest updates on government subsidies and solar tech.', 'solar-face' ); ?></p>
			<form class="subscribe" data-subscribe novalidate>
				<label class="sr-only" for="sub-email"><?php esc_html_e( 'Email address', 'solar-face' ); ?></label>
				<input id="sub-email" name="email" type="email" autocomplete="email" placeholder="<?php esc_attr_e( 'Enter your email', 'solar-face' ); ?>" required>
				<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
				<input type="hidden" name="action" value="solar_face_subscribe">
				<?php wp_nonce_field( 'solar_face_subscribe', 'sf_nonce', false ); ?>
				<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Subscribe', 'solar-face' ); ?></button>
				<p class="sub-status" role="status" hidden data-sub-status></p>
			</form>
		</div>
	</div>

	<p class="wordmark container" aria-hidden="true"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>

	<div class="container footer-legal">
		<p>
			<?php
			/* translators: 1: year, 2: site name. */
			printf( esc_html__( '© %1$s %2$s. All rights reserved.', 'solar-face' ), esc_html( wp_date( 'Y' ) ), esc_html( get_bloginfo( 'name' ) ) );
			if ( solar_face_mod( 'gstin' ) ) {
				echo ' ' . esc_html__( 'GSTIN:', 'solar-face' ) . ' ' . esc_html( solar_face_mod( 'gstin' ) );
			}
			?>
		</p>
		<p><?php esc_html_e( 'Certified by MNRE', 'solar-face' ); ?><span aria-hidden="true">/</span><?php esc_html_e( 'ISO 9001:2015', 'solar-face' ); ?></p>
	</div>
</footer>

<?php if ( $solar_face_phone ) : ?>
	<a class="call-fab" href="tel:+<?php echo esc_attr( solar_face_digits( $solar_face_phone ) ); ?>" aria-label="<?php esc_attr_e( 'Call us', 'solar-face' ); ?>"><i class="ph ph-phone" aria-hidden="true"></i></a>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
