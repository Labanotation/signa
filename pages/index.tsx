import Layout from '../components/layout'

const Home = () => (
  <Layout>
    <h1 className="title">
      Welcome to Signa
    </h1>
    <img id="logo-big" src="/logo.png" alt="Signa" />
    <p className="description">
      A Web application dedicated to Laban notation
    </p>

    <div className="grid">
      <a href="#" className="card">
        <h3>Writing</h3>
        <p></p>
      </a>

      <a href="#" className="card">
        <h3>Publishing</h3>
        <p></p>
      </a>

      <a href="#" className="card">
        <h3>Teaching</h3>
        <p></p>
      </a>
    </div>
    <style jsx>{`
      #logo-big {
        width: 64px;
      }
      .title a {
        color: #0070f3;
        text-decoration: none;
      }

      .title a:hover,
      .title a:focus,
      .title a:active {
        text-decoration: underline;
      }

      .title {
        margin: 0;
        line-height: 1.15;
        font-size: 3rem;
      }

      .title,
      .description {
        text-align: center;
      }

      .description {
        line-height: 1.5;
        font-size: 1.5rem;
      }

      code {
        background: #fafafa;
        border-radius: 5px;
        padding: 0.75rem;
        font-size: 1.1rem;
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
          DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
      }

      .grid {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 1rem;
      }

      .card {
        margin: 1rem;
        flex-basis: 30%;
        padding: 1.5rem;
        text-align: left;
        color: inherit;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .card:hover,
      .card:focus,
      .card:active {
        color: #0070f3;
        border-color: #0070f3;
      }

      .card h3 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }

      .card p {
        margin: 0;
        font-size: 1.25rem;
        line-height: 1.5;
      }

      @media (max-width: 600px) {
        .grid {
          width: 100%;
          flex-direction: column;
        }
      }
    `}</style>
  </Layout>
)

export default Home