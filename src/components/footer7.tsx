import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { cn } from "@/src/libs/utils";
import Link from "next/link";

interface FooterLink {
  name: string;
  href: string;
}
interface FooterSection {
  title: string;
  links: FooterLink[];
}
interface FooterSocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}
interface FooterLogo {
  url: string;
  src: string;
  alt: string;
  title: string;
}

interface FooterBasicProps {
  logo?: FooterLogo;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  legalLinks?: FooterLink[];
  className?: string;
}

type Footer7Props = FooterBasicProps;
type Props = Partial<Footer7Props>;

const defaultProps: Footer7Props = {
  logo: {
    url: "https://www.shadcnblocks.com",
    src: "/images/logo/shadcnblocks-logo-word.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  description: "Finely crafted blocks built with Shadcn UI.",
  sections: [
    {
      title: "Product",
      links: [
        { name: "Overview", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Marketplace", href: "#" },
        { name: "Features", href: "#" },
        { name: "Integrations", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Team", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help center", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Status", href: "#" },
        { name: "Community", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Guides", href: "#" },
        { name: "Templates", href: "#" },
        { name: "Sales", href: "#" },
        { name: "Advertise", href: "#" },
      ],
    },
  ],
  socialLinks: [
    {
      icon: <FaInstagram className="size-5" />,
      href: "#",
      label: "Instagram",
    },
    { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
    { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
    { icon: <FaGithub className="size-5" />, href: "#", label: "GitHub" },
  ],
  copyright: "© 2024 Shadcnblocks.com. All rights reserved.",
  legalLinks: [
    { name: "Terms and Conditions", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
};

const Footer7 = (props: Props) => {
  const {
    logo,
    sections,
    description,
    socialLinks,
    copyright,
    legalLinks,
    className,
  } = {
    ...defaultProps,
    ...props,
  };

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-between gap-10 py-12 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <Link href={logo?.url || "/"} className="flex items-center gap-2">
              <img
                src={logo?.src}
                alt={logo?.alt}
                title={logo?.title}
                className="h-7 dark:invert"
              />
            </Link>
            <p className="text-sm text-muted-foreground md:max-w-sm">
              {description}
            </p>
            <ul className="flex items-center space-x-5 text-muted-foreground">
              {socialLinks?.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-8 sm:grid-cols-2 md:grid-cols-4">
            {sections?.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-semibold tracking-tight text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-border py-6 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p>{copyright}</p>
          <ul className="flex flex-col gap-2 md:flex-row">
            {legalLinks?.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export { Footer7 };
