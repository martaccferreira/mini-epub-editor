import { IconBrandGithub, IconBrandLinkedin } from "justd-icons";
import { Link } from "ui";

const navigation = {
  stack: [
    { name: "Remix", href: "https://remix.run/" },
    { name: "Justd", href: "https://intentui.com/" },
    { name: "Vite", href: "https://vite.dev/" },
  ],
  resources: [
    {
      name: "Justd Starter Kit with Remix",
      href: "https://github.com/intentuilabs/remix",
    },
    {
      name: "Epub icons on Flaticon",
      href: "https://www.flaticon.com/free-icons/epub",
    },
    {
      name: "More icons by Krystsina Mikhailouskaya",
      href: "https://www.flaticon.com/authors/krystsina-mikhailouskaya",
    },
  ],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/martaccferreira",
      icon: <IconBrandGithub />,
    },
    {
      name: "Linkedin",
      href: "https://www.linkedin.com/in/marta-cc-ferreira/",
      icon: <IconBrandLinkedin />,
    },
  ],
};

export function Footer() {
  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-fg text-sm leading-6">
                  Tech Stack
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.stack.map((item) => (
                    <li key={item.name}>
                      <Link
                        target="_blank"
                        href={item.href}
                        className="text-muted-fg text-sm leading-6 hover:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-fg text-sm leading-6">
                  Resources
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        target="_blank"
                        href={item.href}
                        className="text-muted-fg text-sm leading-6 hover:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-slate-900/10 border-t pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <div className="flex space-x-6 md:order-2">
            {navigation.social.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-fg hover:text-fg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-[1.5]"
              >
                <span className="sr-only">{item.name}</span>
                {item.icon}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-muted-fg text-xs leading-5 md:order-1 md:mt-0">
            &copy; 2025 Minimalistic EPUB Editor by{" "}
            <a
              target="_blank"
              href="#"
              className="font-semibold text-fg"
              rel="noreferrer"
            >
              martaccferreira
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
