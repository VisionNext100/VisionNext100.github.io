import { SITE } from '../data/site'
import { CopyToast, useCopyToast } from './ui/CopyToast'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()
  const { toast, copy } = useCopyToast()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          © {year} {SITE.githubUser}@GitHub.com
        </p>
        <div className="footer__links">
          <button
            type="button"
            className="footer__copy"
            onClick={() => copy('GitHub link', SITE.github)}
          >
            GitHub
          </button>
          <button
            type="button"
            className="footer__copy"
            onClick={() => copy('Email', SITE.email)}
          >
            Email
          </button>
          <a href="#home">Back to top</a>
        </div>
      </div>
      <CopyToast message={toast} />
    </footer>
  )
}
