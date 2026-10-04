<?php
/**
 * Fallback template for posts, pages, archives, search and 404.
 *
 * The homepage uses front-page.php.
 *
 * @package Solar_Face
 */

get_header();
?>

<main id="main" class="page-main">
	<div class="container page-container">
		<?php if ( is_404() ) : ?>
			<header class="page-head">
				<h1 class="h2"><?php esc_html_e( 'Page not found', 'solar-face' ); ?></h1>
				<p class="lead"><?php esc_html_e( 'The page you are looking for does not exist or has moved.', 'solar-face' ); ?></p>
				<p class="page-actions"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to home', 'solar-face' ); ?></a></p>
			</header>
		<?php elseif ( have_posts() ) : ?>

			<?php if ( is_home() || is_archive() || is_search() ) : ?>
				<header class="page-head">
					<h1 class="h2">
						<?php
						if ( is_search() ) {
							/* translators: %s: search query. */
							printf( esc_html__( 'Search results for "%s"', 'solar-face' ), esc_html( get_search_query() ) );
						} elseif ( is_archive() ) {
							the_archive_title();
						} else {
							single_post_title();
						}
						?>
					</h1>
				</header>
				<div class="post-list">
					<?php
					while ( have_posts() ) :
						the_post();
						?>
						<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-item' ); ?>>
							<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
							<p class="post-meta"><?php echo esc_html( get_the_date() ); ?></p>
							<div class="post-excerpt"><?php the_excerpt(); ?></div>
						</article>
					<?php endwhile; ?>
				</div>
				<?php the_posts_pagination(); ?>

			<?php else : ?>
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
						<header class="page-head">
							<h1 class="h2"><?php the_title(); ?></h1>
							<?php if ( is_single() ) : ?>
								<p class="post-meta"><?php echo esc_html( get_the_date() ); ?></p>
							<?php endif; ?>
						</header>
						<?php if ( has_post_thumbnail() ) : ?>
							<figure class="frame entry-image"><?php the_post_thumbnail( 'large' ); ?></figure>
						<?php endif; ?>
						<div class="entry-content">
							<?php
							the_content();
							wp_link_pages();
							?>
						</div>
					</article>
					<?php
					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}
				endwhile;
				?>
			<?php endif; ?>

		<?php else : ?>
			<header class="page-head">
				<h1 class="h2"><?php esc_html_e( 'Nothing here yet', 'solar-face' ); ?></h1>
				<p class="lead"><?php esc_html_e( 'Try a search, or head back to the homepage.', 'solar-face' ); ?></p>
				<?php get_search_form(); ?>
			</header>
		<?php endif; ?>
	</div>
</main>

<?php
get_footer();
