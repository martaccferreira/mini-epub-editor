import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "justd-icons";
import { Button, Link, TextField } from "ui";

const navigation = {
  solutions: [
    { name: "Marketing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Commerce", href: "#" },
    { name: "Insights", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Status", href: "#" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: <IconBrandFacebook />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: <IconBrandInstagram />,
    },
    {
      name: "Twitter",
      href: "#",
      icon: <IconBrandTwitter />,
    },
    {
      name: "GitHub",
      href: "#",
      icon: <IconBrandGithub />,
    },
    {
      name: "YouTube",
      href: "#",
      icon: <IconBrandYoutube />,
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
                  Solutions
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
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
                  Support
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
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
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-fg text-sm leading-6">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
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
                  Legal
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
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
            &copy; 2024 Remix Starter Kit by{" "}
            <a
              target="_blank"
              href="https://getjustd.com"
              className="font-semibold text-fg"
              rel="noreferrer"
            >
              justd
            </a>
            , Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
