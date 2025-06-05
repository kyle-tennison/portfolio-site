import GenericArticle from "../../pages/GenericArticle";

export default function ContactArticle() {
  return (
    <>
      <GenericArticle
        title="Contact"
        date="Last Updated 2025"
        description=""
        readTime="1 minute"
        titleImage="https://kyletennison.b-cdn.net/contact-art.webp"
      >
        <h2>Contact Methods</h2>
        <p>
          The best way to reach me is at{" "}
          <a
            className="clickable"
            onClick={async () => {
              await navigator.clipboard.writeText("kyletennison05@gmail.com");
              alert("Coppied Email to Clipboard");
            }}
          >
            <strong>kyletenison05@gmail.com</strong>
          </a>
          , but you can also reach me on any of my social medias:
        </p>

        <ul>
          <li>
            Twitter:{" "}
            <a
              href="https://twitter.com/kyletennison"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <strong>@kyletennison</strong>
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a
              href="https://linkedin.com/in/kyle-tennison"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <strong>in/kyle-tennison</strong>
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a
              href="https://github.com/kyle-tennison"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <strong>@kyle-tennison</strong>
            </a>
          </li>
        </ul>

        <p>
          For academic-related communications, you can reach me at my university
          email:{" "}
          <a
            className="clickable"
            onClick={async () => {
              await navigator.clipboard.writeText("ktennison3@gatech.com");
              alert("Coppied Email to Clipboard");
            }}
          >
            <strong>ktennison3@gatech.com</strong>
          </a>
        </p>
      </GenericArticle>
    </>
  );
}
