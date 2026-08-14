"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ArchivePage2025() {
  const router = useRouter();

  return (
    <>
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link rel="stylesheet" href="/assets/css/lineicons.css" />
      <link rel="stylesheet" href="/assets/css/ud-styles.css" />
      <link rel="stylesheet" href="/assets/css/gallery.css" />

      {/* ====== Header Start ====== */}
      <header className="ud-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <nav className="navbar navbar-expand-lg">
                <Link className="navbar-brand" href="/">
                  <img src="/assets/images/logo.png" alt="Logo" />
                </Link>

                <div className="navbar-collapse navelist">
                  <ul id="nav" className="navbar-nav">
                    <li className="nav-item">
                      <a className="ud-menu-scroll" href="#home">
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="ud-menu-scroll" href="#about">
                        About
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="ud-menu-scroll" href="#faq">
                        FAQ
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="ud-menu-scroll" href="#gallery">
                        Team
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="ud-menu-scroll" href="#contact">
                        Contact
                      </a>
                    </li>
                    <li className="nav-item">
                      <select
                        className="year-switch"
                        aria-label="Academic year"
                        defaultValue="/2025-26"
                        onChange={(e) => {
                          if (e.target.value) router.push(e.target.value);
                        }}
                      >
                        <option value="/">2026–27</option>
                        <option value="/2025-26">2025–26</option>
                      </select>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* ====== Header End ====== */}

      {/* ====== Hero Start ====== */}
      <section className="ud-hero" id="home">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ud-hero-content">
                <h1 className="ud-hero-title">
                  Acting on a good idea is better than just having a good idea
                </h1>
              </div>
              <div className="ud-hero-image">
                <img src="/assets/images/hero/hero-image.svg" alt="hero-image" />
                <img src="/assets/images/hero/dotted-shape.svg" alt="shape" className="shape shape-1" />
                <img src="/assets/images/hero/dotted-shape.svg" alt="shape" className="shape shape-2" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ====== Hero End ====== */}

      {/* ====== About Start ====== */}
      <section id="about" className="ud-about">
        <div className="container">
          <div className="ud-about-wrapper">
            <div className="ud-about-content-wrapper">
              <div className="ud-about-content">
                <span className="tag">About Us</span>
                <h2>A Place to foster ideas</h2>
                <p>
                  The Innovation and Entrepreneurship Development Centre (IEDC) SIAS is an active organization aiming to foster innovation culture in our institution. IEDC provide venues for creative students to learn and collaborate their innovative ideas into prototypes of viable products and services. We promote technology based startup ventures from the college students and provide them with access to requirements. We organise various workshops, webinars, entalks, competitions for developing the innovative ideas to start new venture as an entrepreneur.
                </p>
              </div>
            </div>
            <div className="ud-about-image">
              <img
                src="https://img.freepik.com/free-vector/flat-hand-drawn-people-starting-business-project_52683-56392.jpg?w=740"
                alt="about-image"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ====== About End ====== */}

      {/* ====== FAQ Start ====== */}
      <section id="faq" className="ud-faq">
        <div className="shape">
          <img src="/assets/images/faq/shape.svg" alt="shape" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ud-section-title text-center mx-auto">
                <span>FAQ</span>
                <h2>Any Questions? Answered</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="ud-single-faq">
                <div className="accordion">
                  <button className="ud-faq-btn">
                    <span>What is IEDC?</span>
                  </button>
                  <div className="ud-faq-body">
                    The Innovation and Entrepreneurship Development Centre (IEDC) is an organisation that aims to promote the institutional vision of transforming youngsters into technological entrepreneurs and innovative leaders. SIAS IEDC believes in a culture outside of textbooks, promoting innovative ideas and regularly supporting the students to develop them into solid projects.
                  </div>
                </div>
              </div>
              <div className="ud-single-faq">
                <div className="accordion">
                  <button className="ud-faq-btn">
                    <span>What is KSUM?</span>
                  </button>
                  <div className="ud-faq-body">
                    The Kerala Startup Mission (KSUM) is the nodal agency of the government of Kerala for promoting entrepreneurship in the state. KSUM was founded in 2006, with the goal to promote technology-based entrepreneurship activities.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ud-single-faq">
                <div className="accordion">
                  <button className="ud-faq-btn">
                    <span>What is startup?</span>
                  </button>
                  <div className="ud-faq-body">
                    The term startup refers to a company in the first stages of operations. Startups are founded by one or more entrepreneurs who want to develop a product or service for which they believe there is demand.
                  </div>
                </div>
              </div>
              <div className="ud-single-faq">
                <div className="accordion">
                  <button className="ud-faq-btn">
                    <span>How IEDC SIAS help us?</span>
                  </button>
                  <div className="ud-faq-body">
                    The SIAS Innovation and Entrepreneurship Development Centre (IEDC) is an active organization aiming to foster innovation culture in our institution.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ====== FAQ End ====== */}

      {/* ====== Team Start ====== */}
      <section id="team" className="ud-team">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ud-section-title mx-auto text-center">
                <span>Our Team</span>
                <h2>Meet The Team 2025–26</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-sm-6">
              <div className="ud-single-team">
                <div className="ud-team-image-wrapper">
                  <div className="ud-team-image">
                    <img src="/photos/principle.jpg" alt="Prof. E. P. Imbichikoya" />
                  </div>
                </div>
                <div className="ud-team-info">
                  <h5>Prof. E. P. Imbichikoya</h5>
                  <h6>Principal</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-sm-6">
              <div className="ud-single-team">
                <div className="ud-team-image-wrapper">
                  <div className="ud-team-image">
                    <img src="/photos/CM32.jpg" alt="Mr. Vasil" />
                  </div>
                </div>
                <div className="ud-team-info">
                  <h5>Mr. Vasil</h5>
                  <h6>IEDC Nodal Officer</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-sm-6">
              <div className="ud-single-team">
                <div className="ud-team-image-wrapper">
                  <div className="ud-team-image">
                    <img src="/photos/25coremembers/shadan (1).jpeg" alt="Shadan" />
                  </div>
                </div>
                <div className="ud-team-info">
                  <h5>Shadan</h5>
                  <h6>IEDC Lead, CEO</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-sm-6">
              <div className="ud-single-team">
                <div className="ud-team-image-wrapper">
                  <div className="ud-team-image">
                    <img src="/photos/25coremembers/amna .jpg" alt="Amna Diya" />
                  </div>
                </div>
                <div className="ud-team-info">
                  <h5>Amna Diya</h5>
                  <h6>IEDC CEO</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ====== Team End ====== */}
    </>
  );
}
