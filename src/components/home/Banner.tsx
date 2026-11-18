import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="banner" aria-label="PizzaHub hero banner">
      <div className="banner-inner">
        <div className="banner-content">
          <span className="banner-eyebrow">🔥 Fresh from the oven</span>

          <h1 className="banner-title">
            Hot &amp; Fresh Pizza,{" "}
            <span className="gradient-text">Delivered Fast</span>
          </h1>

          <p className="banner-desc">
            Discover top-rated local pizzerias, customize your favorite slices
            and get them delivered hot to your door — all in one place.
          </p>

          <div className="banner-actions">
            <Link href="/browse-menu" className="btn-primary banner-cta">
              Explore Pizza Menu
              <ArrowRight className="banner-cta-icon" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
