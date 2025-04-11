import { IconBrandGithub } from "justd-icons";
import { Link, Navbar, Separator, buttonStyles } from "ui";
import { ThemeSwitcher } from "~/components/theme-switcher";
import icon from "/favicon.ico?url";

const navigations = [
  {
    name: "EPUB Editor",
    url: "/",
  },
];

export function AppNavbar() {
  return (
    <Navbar>
      <Navbar.Nav>
        <Navbar.Logo href="/">
          <img alt="app icon" src={icon} width="25" height="25" />
        </Navbar.Logo>
        <Navbar.Section>
          {navigations.map((item) => (
            <Navbar.Item key={item.url} href={item.url}>
              {item.name}
            </Navbar.Item>
          ))}
        </Navbar.Section>
        <Navbar.Section className="ml-auto hidden gap-x-1 lg:flex">
          <ThemeSwitcher />
          <Link
            className={buttonStyles({
              intent: "outline",
              size: "square-petite",
            })}
            href="https://github.com/martaccferreira/mini-epub-editor"
            target="_blank"
            aria-label="Go to Github Repo"
          >
            <IconBrandGithub />
          </Link>
        </Navbar.Section>
      </Navbar.Nav>

      <Navbar.Compact>
        <Navbar.Flex>
          <Navbar.Trigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <Navbar.Logo href="/">
            <img alt="app icon" src={icon} width="25" height="25" />
          </Navbar.Logo>
        </Navbar.Flex>
        <Navbar.Flex className="gap-x-1">
          <ThemeSwitcher />
          <Link
            className={buttonStyles({
              intent: "outline",
              size: "square-petite",
            })}
            href="https://github.com/martaccferreira/mini-epub-editor"
            target="_blank"
            aria-label="Go to Github Repo"
          >
            <IconBrandGithub />
          </Link>
        </Navbar.Flex>
      </Navbar.Compact>
    </Navbar>
  );
}
