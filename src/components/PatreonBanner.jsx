export default function PatreonBanner({ loginStatusRef }) {
  return (
    <>
      <div className="patreon-text">
        <h1 className="text-center my-0">Multiplier:</h1>

        {!loginStatusRef.current.logged_in && (
          <p
            className="my-1.5 px-2.5"
            style={{
              // marginBottom: "5px",
              // marginTop: "5px",
              backgroundColor: "#630c0cff",
              color: "#fafafaff",
            }}
          >
            To save and recall your own presets and to use MIDI functionality
            you must be a member of
            <b>
              {" "}
              <a
                href="https://www.patreon.com/user?u=90105560&amp;utm_source=http%3A%2F%2Flocalhost%3A8888%2Fpatreon-test-post%2F&amp;utm_medium=patreon_wordpress_plugin&amp;utm_campaign=14548621&amp;utm_term=&amp;utm_content=creator_profile_link_in_text_over_interface"
                target="_blank"
              >
                Doug’s Patreon
              </a>{" "}
              at $3{" "}
            </b>{" "}
            or more.{" "}
            <a
              href="http://localhost:8888/patreon-flow/?patreon-unlock-post=8"
              target="_blank"
            >
              Unlock with Patreon
            </a>{" "}
            Already a qualifying Patreon member?{" "}
            <a
              href="http://localhost:8888/patreon-flow/?patreon-login=yes&amp;patreon-final-redirect=http%3A%2F%2Flocalhost%3A8888%2Fpatreon-test-post"
              rel="nofollow"
            >
              Refresh
            </a>{" "}
            to access this content.
          </p>
        )}
      </div>
    </>
  );
}
