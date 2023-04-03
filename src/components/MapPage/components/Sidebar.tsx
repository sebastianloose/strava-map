import styles from "./Sidebar.module.scss";
import stravaConnect from "../../../assets/strava-branding/connect.svg";
import stravaFooter from "../../../assets/strava-branding/footer.svg";

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <h1>
        Strava Map<span className="accentFont">.</span>
      </h1>
      <p className={styles.subheader}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, cum
        commodi veritatis eveniet id qui saepe dolore eius architecto.
      </p>

      <div className={styles.contentContainer}>
        <p className={styles.connectStravaLabel}>
          To get started, log in with Strava
        </p>
        <button>
          <img src={stravaConnect} />
        </button>
      </div>
      <div className={styles.footerRow}>
        <a
          href="https://github.com/sebastianloose"
          target="_blank"
          className="link"
        >
          GitHub
        </a>
        <p className={styles.spacer}>•</p>
        <img src={stravaFooter} className={styles.stravaFooter} />
      </div>
    </div>
  );
};

export default Sidebar;
