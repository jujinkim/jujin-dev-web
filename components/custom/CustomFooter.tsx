import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import style from "./CustomFooter.scss"

export default (() => {
  const CustomFooter: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()

    return (
      <footer class={`custom-footer ${displayClass ?? ""}`}>
        <div class="custom-footer__content">
          <p class="custom-footer__copyright">
            <a href="https://jujin.kim">jujin.kim</a> © {year}, Powered by{" "}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>,{" "}
            <a href="https://obsidian.md" target="_blank" rel="noopener noreferrer">Obsidian</a> and{" "}
            <a href="https://quartz.jzhao.xyz" target="_blank" rel="noopener noreferrer">Quartz</a>
          </p>
          <ul class="custom-footer__links">
            <li>
              <a href="https://github.com/jujinkim" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
            <li>
              <a href="https://jujin.kim">jujin.kim</a>
            </li>
            <li>
              <a href="https://cozelsil.com" target="_blank" rel="noopener noreferrer">Cozelsil</a>
            </li>
            <li>
              <a href="https://1q2w.kr" target="_blank" rel="noopener noreferrer">1q2w.kr</a>
            </li>
          </ul>
        </div>
      </footer>
    )
  }

  CustomFooter.css = style
  return CustomFooter
}) satisfies QuartzComponentConstructor
