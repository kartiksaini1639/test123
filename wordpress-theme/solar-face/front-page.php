<?php
/**
 * One-page front page.
 *
 * Shown on the homepage whether it is set to "Your latest posts" or a static page.
 *
 * @package Solar_Face
 */

get_header();

$solar_face_phone = solar_face_mod( 'phone' );
$solar_face_tel   = 'tel:+' . solar_face_digits( $solar_face_phone );
$solar_face_cta   = __( 'Get Free Consultation', 'solar-face' );

$solar_face_plans = array(
	array(
		'name'     => __( 'Residential 3kW', 'solar-face' ),
		'price'    => solar_face_mod( 'price_3kw' ),
		'desc'     => __( 'Ideal for 2-3 BHK homes. Covers lights, fans, TV, and fridge.', 'solar-face' ),
		'featured' => false,
		'features' => array(
			__( '3kW System Capacity', 'solar-face' ),
			__( 'Generates ~360 Units/Month', 'solar-face' ),
			__( 'Subsidy Eligible', 'solar-face' ),
			__( '25 Year Performance Warranty', 'solar-face' ),
			__( '1 Year Maintenance', 'solar-face' ),
		),
	),
	array(
		'name'     => __( 'Residential 5kW', 'solar-face' ),
		'price'    => solar_face_mod( 'price_5kw' ),
		'desc'     => __( 'Perfect for 3-4 BHK homes with AC usage.', 'solar-face' ),
		'featured' => true,
		'features' => array(
			__( '5kW System Capacity', 'solar-face' ),
			__( 'Generates ~600 Units/Month', 'solar-face' ),
			__( 'Subsidy Eligible', 'solar-face' ),
			__( 'Smart WiFi Monitoring', 'solar-face' ),
			__( '25 Year Performance Warranty', 'solar-face' ),
			__( 'High Efficiency Panels', 'solar-face' ),
		),
	),
	array(
		'name'     => __( 'Commercial 10kW+', 'solar-face' ),
		'price'    => solar_face_mod( 'price_10kw' ),
		'desc'     => __( 'For offices, shops, and small factories.', 'solar-face' ),
		'featured' => false,
		'features' => array(
			__( '10kW+ Custom Sizing', 'solar-face' ),
			__( 'Generates ~1200+ Units/Month', 'solar-face' ),
			__( 'Accelerated Depreciation', 'solar-face' ),
			__( 'Net Metering Support', 'solar-face' ),
			__( 'Priority Support 24/7', 'solar-face' ),
			__( 'Dedicated Project Manager', 'solar-face' ),
		),
	),
);

$solar_face_steps = array(
	array( 'ph-calendar-check', __( 'Consultation and site survey', 'solar-face' ), __( 'We check your roof, shading and past bills to size the right system.', 'solar-face' ) ),
	array( 'ph-file-text', __( 'Subsidy and DISCOM approvals', 'solar-face' ), __( 'We register you on the PM Surya Ghar portal and apply for net metering.', 'solar-face' ) ),
	array( 'ph-wrench', __( 'Installation', 'solar-face' ), __( 'Structure, panels and inverter installed by our team, usually within days.', 'solar-face' ) ),
	array( 'ph-plug-charging', __( 'Net metering and commissioning', 'solar-face' ), __( 'The net meter is fitted, the system goes live and your subsidy is claimed.', 'solar-face' ) ),
	array( 'ph-sun', __( 'Save from day one', 'solar-face' ), __( 'Track generation on your phone with our support on call.', 'solar-face' ) ),
);

$solar_face_reviews = array(
	array( __( 'Solar Face handled everything from subsidy paperwork to installation. I received my subsidy of ₹78,000 on time. My bill is now zero!', 'solar-face' ), 'Rajesh Kumar', __( 'Bangalore, Karnataka', 'solar-face' ) ),
	array( __( 'Excellent 5kW system for my home. The team was very professional. It runs my ACs perfectly during the day. Highly recommended!', 'solar-face' ), 'Priya Sharma', __( 'Pune, Maharashtra', 'solar-face' ) ),
	array( __( 'Best investment for our factory. We are saving around ₹40,000 per month on electricity. ROI is fantastic with Solar Face.', 'solar-face' ), 'Vikram Singh', __( 'Jaipur, Rajasthan', 'solar-face' ) ),
);

$solar_face_faqs = array(
	array( __( 'How do I get the Government Subsidy?', 'solar-face' ), __( 'Register on the PM Surya Ghar national portal, get DISCOM approval, and install through a registered vendor. After net metering and inspection, the subsidy is credited to your bank account. We handle every step for you.', 'solar-face' ) ),
	array( __( 'What is Net Metering in India?', 'solar-face' ), __( "A bi-directional meter records the power you draw from the grid and the surplus your panels export. You pay only for the net units used, and extra units are credited as per your state's policy.", 'solar-face' ) ),
	array( __( 'Does solar work during Indian monsoons?', 'solar-face' ), __( 'Yes. Panels still generate on cloudy days, at a lower output. Systems are sized on yearly generation, so the strong summer months balance the monsoon dip.', 'solar-face' ) ),
	/* translators: %s: EMI starting amount. */
	array( __( 'Are EMI options available?', 'solar-face' ), sprintf( __( 'Yes. EMIs start from %s/month through partner banks, including low-interest loans available under PM Surya Ghar.', 'solar-face' ), solar_face_mod( 'emi_from' ) ) ),
	array( __( 'What happens if there is a power cut?', 'solar-face' ), __( 'On-grid systems switch off during a grid outage for safety. For backup during power cuts, choose a hybrid system with batteries.', 'solar-face' ) ),
	array( __( 'Do I need to pay GST?', 'solar-face' ), __( 'Yes. GST applies to solar systems and is included in the final itemised quote we share with you.', 'solar-face' ) ),
	array( __( 'What is the warranty provided?', 'solar-face' ), __( 'Panels carry a 25 year performance warranty. Inverter and workmanship warranties are listed in your quote.', 'solar-face' ) ),
);
?>

<main id="main">
	<!-- Hero -->
	<section class="hero" id="home">
		<div class="container">
			<p class="hero-kicker rise" style="--i:0"><?php esc_html_e( '#1 Solar choice in India', 'solar-face' ); ?></p>
			<h1 class="hero-title rise" style="--i:1"><?php esc_html_e( 'Solar energy solutions for', 'solar-face' ); ?> <span><?php esc_html_e( 'Indian homes & business', 'solar-face' ); ?></span></h1>
			<div class="hero-row">
				<p class="hero-sub rise" style="--i:2"><?php esc_html_e( 'Switch to solar and save up to 90% on electricity bills. Get maximum government subsidies, easy EMI options, and complete energy independence.', 'solar-face' ); ?></p>
				<div class="hero-ctas rise" style="--i:3">
					<a class="btn btn-primary btn-lg" href="#contact"><?php echo esc_html( $solar_face_cta ); ?> <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
					<a class="btn btn-ghost btn-lg" href="#schemes"><?php esc_html_e( 'Check Subsidies', 'solar-face' ); ?></a>
				</div>
			</div>
		</div>
		<div class="container">
			<figure class="frame frame-hero rise" style="--i:4" data-img-frame>
				<img class="drift" src="<?php echo esc_url( solar_face_mod( 'img_hero' ) ); ?>" alt="<?php esc_attr_e( 'A modern home with solar panels across its roof', 'solar-face' ); ?>" width="2200" height="1467" fetchpriority="high" data-img>
			</figure>
		</div>
	</section>

	<!-- Key figures -->
	<section class="figures" aria-label="<?php esc_attr_e( 'At a glance', 'solar-face' ); ?>">
		<dl class="container figures-row">
			<div class="reveal"><dd><small><?php esc_html_e( 'Up to', 'solar-face' ); ?></small> <span data-count="90">90</span>%</dd><dt><?php esc_html_e( 'Lower electricity bills', 'solar-face' ); ?></dt></div>
			<div class="reveal"><dd>₹<span data-count="78000">78,000</span></dd><dt><?php esc_html_e( 'Maximum home subsidy', 'solar-face' ); ?></dt></div>
			<div class="reveal"><dd>3-4<small><?php esc_html_e( 'yrs', 'solar-face' ); ?></small></dd><dt><?php esc_html_e( 'Typical payback', 'solar-face' ); ?></dt></div>
			<div class="reveal"><dd><span data-count="1000">1,000</span>+</dd><dt><?php esc_html_e( 'Happy Indian homes', 'solar-face' ); ?></dt></div>
		</dl>
	</section>

	<!-- Why Solar Face -->
	<section class="section" id="features">
		<div class="container">
			<h2 class="label reveal"><?php esc_html_e( 'Why Solar Face?', 'solar-face' ); ?></h2>
			<p class="statement" data-scrub><?php esc_html_e( 'Empowering India with clean energy. We help you navigate subsidies, installation, and approvals.', 'solar-face' ); ?></p>

			<div class="bento reveal">
				<article class="cell cell-subsidy">
					<i class="ph ph-bank cell-icon" aria-hidden="true"></i>
					<div>
						<p class="cell-figure">₹78,000</p>
						<h3><?php esc_html_e( 'Government Subsidies', 'solar-face' ); ?></h3>
						<p><?php esc_html_e( 'Avail central and state government subsidies like PM Surya Ghar Yojana to reduce your initial investment significantly.', 'solar-face' ); ?></p>
					</div>
				</article>
				<article class="cell">
					<i class="ph ph-currency-inr cell-icon" aria-hidden="true"></i>
					<div>
						<h3><?php esc_html_e( 'Affordable & High ROI', 'solar-face' ); ?></h3>
						<p><?php esc_html_e( 'Designed for the Indian market with easy EMI options. Recover your investment in 3-4 years and enjoy free electricity.', 'solar-face' ); ?></p>
					</div>
				</article>
				<article class="cell">
					<i class="ph ph-lightning cell-icon" aria-hidden="true"></i>
					<div>
						<h3><?php esc_html_e( 'Net Metering Benefits', 'solar-face' ); ?></h3>
						<p><?php esc_html_e( 'Sell excess power back to the grid. Our systems are fully compatible with DISCOM net metering policies across India.', 'solar-face' ); ?></p>
					</div>
				</article>
				<article class="cell cell-image" data-img-frame>
					<img class="drift" src="<?php echo esc_url( solar_face_mod( 'img_climate' ) ); ?>" alt="<?php esc_attr_e( 'High efficiency solar panels in bright sunlight', 'solar-face' ); ?>" width="1600" height="1067" loading="lazy" data-img>
					<div class="cell-image-body">
						<h3><?php esc_html_e( 'Built for Indian Climate', 'solar-face' ); ?></h3>
						<p><?php esc_html_e( 'High efficiency panels tested for Indian summers and monsoons, ensuring consistent performance year-round.', 'solar-face' ); ?></p>
					</div>
				</article>
			</div>
		</div>
	</section>

	<!-- Govt schemes -->
	<section class="section section-alt" id="schemes">
		<div class="container schemes">
			<div class="layered reveal" aria-hidden="true">
				<figure class="frame frame-back" data-img-frame>
					<img class="drift" src="<?php echo esc_url( solar_face_mod( 'img_schemes_1' ) ); ?>" alt="" width="1200" height="1500" loading="lazy" data-img>
				</figure>
				<figure class="frame frame-front" data-img-frame>
					<img src="<?php echo esc_url( solar_face_mod( 'img_schemes_2' ) ); ?>" alt="" width="900" height="900" loading="lazy" data-img>
				</figure>
			</div>
			<div class="schemes-copy">
				<h2 class="h2 reveal"><?php esc_html_e( 'PM Surya Ghar subsidy, handled for you', 'solar-face' ); ?></h2>
				<p class="lead reveal"><?php esc_html_e( 'Central financial assistance for residential rooftop solar, credited directly to your bank account. We file and track the application for you.', 'solar-face' ); ?></p>
				<dl class="scheme-list reveal">
					<div><dt><?php esc_html_e( 'Up to 2 kW', 'solar-face' ); ?></dt><dd>₹30,000<small>/kW</small></dd></div>
					<div><dt><?php esc_html_e( 'Additional kW, up to 3 kW', 'solar-face' ); ?></dt><dd>₹18,000<small>/kW</small></dd></div>
					<div class="is-max"><dt><?php esc_html_e( 'Maximum for homes', 'solar-face' ); ?></dt><dd>₹78,000</dd></div>
				</dl>
				<p class="fine reveal">
					<?php esc_html_e( 'State subsidies may add to this. Housing societies and RWAs receive ₹18,000/kW for common facilities. Details at', 'solar-face' ); ?>
					<a href="https://pmsuryaghar.gov.in" target="_blank" rel="noopener">pmsuryaghar.gov.in</a>.
				</p>
			</div>
		</div>
	</section>

	<!-- Process -->
	<section class="section" id="process">
		<div class="container">
			<div class="section-intro reveal">
				<p class="eyebrow"><?php esc_html_e( 'Hassle-free process', 'solar-face' ); ?></p>
				<h2 class="h2"><?php esc_html_e( 'How it works in India', 'solar-face' ); ?></h2>
				<p class="lead"><?php esc_html_e( 'From application to net-metering, Solar Face manages the complete solar journey for you.', 'solar-face' ); ?></p>
			</div>
			<ol class="rhythm">
				<?php foreach ( $solar_face_steps as $solar_face_step ) : ?>
					<li class="reveal"><i class="ph <?php echo esc_attr( $solar_face_step[0] ); ?>" aria-hidden="true"></i><h3><?php echo esc_html( $solar_face_step[1] ); ?></h3><p><?php echo esc_html( $solar_face_step[2] ); ?></p></li>
				<?php endforeach; ?>
			</ol>
		</div>
	</section>

	<!-- Pricing -->
	<section class="section section-alt" id="pricing">
		<div class="container">
			<div class="section-intro reveal">
				<h2 class="h2"><?php esc_html_e( 'Transparent Pricing', 'solar-face' ); ?></h2>
				<p class="lead"><?php esc_html_e( 'Competitive pricing designed for the Indian market.', 'solar-face' ); ?></p>
			</div>
			<div class="plans">
				<?php foreach ( $solar_face_plans as $solar_face_plan ) : ?>
					<article class="plan<?php echo $solar_face_plan['featured'] ? ' plan-featured' : ''; ?> reveal">
						<h3>
							<?php echo esc_html( $solar_face_plan['name'] ); ?>
							<?php if ( $solar_face_plan['featured'] ) : ?>
								<span class="plan-note"><?php esc_html_e( 'Most popular', 'solar-face' ); ?></span>
							<?php endif; ?>
						</h3>
						<p class="plan-price"><span><?php esc_html_e( 'Starts @', 'solar-face' ); ?></span><?php echo esc_html( $solar_face_plan['price'] ); ?><sup>*</sup></p>
						<p class="plan-desc"><?php echo esc_html( $solar_face_plan['desc'] ); ?></p>
						<ul>
							<?php foreach ( $solar_face_plan['features'] as $solar_face_feature ) : ?>
								<li><i class="ph ph-check" aria-hidden="true"></i><?php echo esc_html( $solar_face_feature ); ?></li>
							<?php endforeach; ?>
						</ul>
						<a class="btn <?php echo $solar_face_plan['featured'] ? 'btn-light' : 'btn-ghost'; ?> btn-block" href="#contact" data-plan="<?php echo esc_attr( $solar_face_plan['name'] ); ?>"><?php echo esc_html( $solar_face_cta ); ?></a>
					</article>
				<?php endforeach; ?>
			</div>
			<div class="pricing-foot reveal">
				<?php /* translators: %s: EMI starting amount. */ ?>
				<p><?php echo esc_html( sprintf( __( 'Easy EMI options available starting from %s/month. Ask our experts about bank financing.', 'solar-face' ), solar_face_mod( 'emi_from' ) ) ); ?></p>
				<p class="fine"><?php esc_html_e( '*Prices indicated are approximate market rates before subsidy. Actual cost may vary.', 'solar-face' ); ?></p>
			</div>
		</div>
	</section>

	<!-- Reviews -->
	<section class="section" id="reviews">
		<div class="container quotes">
			<div class="quotes-head reveal">
				<h2 class="h2"><?php esc_html_e( 'Trusted by Indian Families', 'solar-face' ); ?></h2>
				<p class="lead"><?php esc_html_e( 'Join thousands of satisfied customers across India saving lakhs on electricity.', 'solar-face' ); ?></p>
				<div class="stars" role="img" aria-label="<?php esc_attr_e( 'Customers rate us 5 out of 5', 'solar-face' ); ?>"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
			</div>
			<div class="quotes-wall">
				<?php foreach ( $solar_face_reviews as $solar_face_review ) : ?>
					<figure class="quote reveal">
						<blockquote>“<?php echo esc_html( $solar_face_review[0] ); ?>”</blockquote>
						<figcaption><strong><?php echo esc_html( $solar_face_review[1] ); ?></strong><span><?php echo esc_html( $solar_face_review[2] ); ?></span></figcaption>
					</figure>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="section section-alt" id="faq">
		<div class="container">
			<div class="section-intro reveal">
				<h2 class="h2"><?php esc_html_e( 'Frequently Asked Questions', 'solar-face' ); ?></h2>
				<p class="lead"><?php esc_html_e( 'Everything you need to know about going solar in India.', 'solar-face' ); ?></p>
			</div>
			<div class="faq reveal" data-accordion>
				<?php foreach ( $solar_face_faqs as $solar_face_i => $solar_face_faq ) : ?>
					<div class="faq-item">
						<h3><button type="button" aria-expanded="false" aria-controls="q<?php echo (int) $solar_face_i; ?>" id="q<?php echo (int) $solar_face_i; ?>b"><?php echo esc_html( $solar_face_faq[0] ); ?><i class="ph ph-plus" aria-hidden="true"></i></button></h3>
						<div class="faq-panel" id="q<?php echo (int) $solar_face_i; ?>" role="region" aria-labelledby="q<?php echo (int) $solar_face_i; ?>b"><div><p><?php echo esc_html( $solar_face_faq[1] ); ?></p></div></div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- Contact -->
	<section class="contact" id="contact">
		<div class="contact-bg" data-img-frame aria-hidden="true">
			<img class="drift" src="<?php echo esc_url( solar_face_mod( 'img_contact' ) ); ?>" alt="" width="2200" height="1467" loading="lazy" data-img>
		</div>
		<div class="container contact-grid">
			<div class="contact-copy reveal">
				<h2 class="h2"><?php esc_html_e( 'Get Your Free Quote', 'solar-face' ); ?></h2>
				<p class="lead"><?php esc_html_e( 'Fill the form to get an instant call back from our solar experts.', 'solar-face' ); ?></p>
				<ul class="contact-points">
					<li><i class="ph ph-seal-check" aria-hidden="true"></i><?php esc_html_e( 'MNRE Channel Partners', 'solar-face' ); ?></li>
					<li><i class="ph ph-file-text" aria-hidden="true"></i><?php esc_html_e( 'Subsidy Assistance', 'solar-face' ); ?></li>
					<li><i class="ph ph-users-three" aria-hidden="true"></i><?php esc_html_e( '1000+ Happy Indian Homes', 'solar-face' ); ?></li>
					<li><i class="ph ph-shield-check" aria-hidden="true"></i><?php esc_html_e( '25 Years Warranty', 'solar-face' ); ?></li>
				</ul>
				<?php if ( $solar_face_phone ) : ?>
					<p class="contact-call"><span><?php esc_html_e( 'Call us directly', 'solar-face' ); ?></span><a href="<?php echo esc_attr( $solar_face_tel ); ?>"><?php echo esc_html( $solar_face_phone ); ?></a></p>
				<?php endif; ?>
				<?php if ( solar_face_mod( 'whatsapp' ) ) : ?>
					<p class="contact-wa"><a href="<?php echo esc_url( 'https://wa.me/' . solar_face_digits( solar_face_mod( 'whatsapp' ) ) ); ?>" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo" aria-hidden="true"></i><?php esc_html_e( 'Chat on WhatsApp', 'solar-face' ); ?></a></p>
				<?php endif; ?>
			</div>

			<form class="form reveal" data-lead-form novalidate>
				<div class="row">
					<div class="field"><label for="f-name"><?php esc_html_e( 'Full Name', 'solar-face' ); ?></label>
						<input id="f-name" name="name" type="text" autocomplete="name" placeholder="<?php esc_attr_e( 'Amit Verma', 'solar-face' ); ?>" required aria-describedby="f-name-err">
						<p class="error" id="f-name-err" hidden><i class="ph ph-warning-circle" aria-hidden="true"></i><?php esc_html_e( 'Please enter your name.', 'solar-face' ); ?></p></div>
					<div class="field"><label for="f-email"><?php esc_html_e( 'Email Address', 'solar-face' ); ?></label>
						<input id="f-email" name="email" type="email" autocomplete="email" placeholder="amit@example.com" aria-describedby="f-email-err">
						<p class="error" id="f-email-err" hidden><i class="ph ph-warning-circle" aria-hidden="true"></i><?php esc_html_e( 'Enter a valid email or leave it blank.', 'solar-face' ); ?></p></div>
				</div>
				<div class="row">
					<div class="field"><label for="f-phone"><?php esc_html_e( 'Phone Number (+91)', 'solar-face' ); ?></label>
						<input id="f-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="10" placeholder="98765 43210" required aria-describedby="f-phone-err">
						<p class="error" id="f-phone-err" hidden><i class="ph ph-warning-circle" aria-hidden="true"></i><?php esc_html_e( 'Enter a 10-digit mobile number.', 'solar-face' ); ?></p></div>
					<div class="field"><label for="f-city"><?php esc_html_e( 'City / State', 'solar-face' ); ?></label>
						<input id="f-city" name="city" type="text" autocomplete="address-level2" placeholder="<?php esc_attr_e( 'e.g. Bangalore, Delhi, Mumbai', 'solar-face' ); ?>"></div>
				</div>
				<div class="field"><label for="f-type"><?php esc_html_e( 'Type of Solar Solution', 'solar-face' ); ?></label>
					<select id="f-type" name="type">
						<option value=""><?php esc_html_e( 'Select Requirement', 'solar-face' ); ?></option>
						<?php foreach ( $solar_face_plans as $solar_face_plan ) : ?>
							<option><?php echo esc_html( $solar_face_plan['name'] ); ?></option>
						<?php endforeach; ?>
						<option><?php esc_html_e( 'Not sure yet', 'solar-face' ); ?></option>
					</select></div>
				<label class="check"><input type="checkbox" name="subsidy" value="yes"><span><?php esc_html_e( 'Check eligibility for Govt Subsidy?', 'solar-face' ); ?></span></label>
				<div class="field"><label for="f-msg"><?php esc_html_e( 'Message (optional)', 'solar-face' ); ?></label>
					<textarea id="f-msg" name="message" rows="3" placeholder="<?php esc_attr_e( 'Tell us about your roof area or monthly electricity bill...', 'solar-face' ); ?>"></textarea></div>
				<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
				<input type="hidden" name="action" value="solar_face_lead">
				<?php wp_nonce_field( 'solar_face_lead', 'sf_nonce', false ); ?>
				<button class="btn btn-primary btn-lg btn-block" type="submit" data-submit><span><?php echo esc_html( $solar_face_cta ); ?></span><i class="ph ph-spinner-gap spin" aria-hidden="true" hidden data-spinner></i></button>
				<p class="status" role="status" hidden data-status></p>
			</form>
		</div>
	</section>
</main>

<?php
get_footer();
