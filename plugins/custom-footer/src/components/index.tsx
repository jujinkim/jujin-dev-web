import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

const style = `
.custom-footer { margin: 4rem 0; opacity: .7; text-align: right; }
.custom-footer__content { align-items: flex-end; display: flex; flex-direction: column; gap: .5rem; }
.custom-footer p, .custom-footer ul { margin: 0; }
.custom-footer p, .custom-footer ul { font-size: .9rem; }
.custom-footer ul { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: flex-end; list-style: none; padding: 0; }
.custom-footer a { color: inherit; text-decoration: none; }
.custom-footer a:hover { color: var(--secondary); text-decoration: underline; }
`

export const CustomFooter: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ displayClass }) => (
    <footer class={`custom-footer ${displayClass ?? ""}`}>
      <div class="custom-footer__content">
        <p>
          <a href="https://jujin.kim">jujin.kim</a> © {new Date().getFullYear()}, Powered by{" "}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          ,{" "}
          <a href="https://obsidian.md" target="_blank" rel="noopener noreferrer">
            Obsidian
          </a>{" "}
          and{" "}
          <a href="https://quartz.jzhao.xyz" target="_blank" rel="noopener noreferrer">
            Quartz
          </a>
        </p>
        <ul>
          <li>
            <a href="https://github.com/jujinkim" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://jujin.kim">jujin.kim</a>
          </li>
          <li>
            <a href="https://cozelsil.com" target="_blank" rel="noopener noreferrer">
              Cozelsil
            </a>
          </li>
          <li>
            <a href="https://1q2w.kr" target="_blank" rel="noopener noreferrer">
              1q2w.kr
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
  Component.css = style
  return Component
}
