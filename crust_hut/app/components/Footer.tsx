import PiazzoLogo from "./PiazzoLogo";

const explore = [
  { label: "Best Sellers", href: "#bestsellers" },
  { label: "Chef's Special", href: "#special" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reserve", href: "/contact#reserve" },
];

const company = [
  { label: "Our Story", href: "/about" },
  { label: "Why PIAZZO", href: "/#why" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-charcoal">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex">
              <PiazzoLogo
                variant="full"
                markSize={36}
                tone="brand"
                wordmarkClassName="text-white"
              />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Born of Fire. Premium wood-fired pizza with modern energy and a
              table for everyone.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-flame">
              Born of Fire.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {explore.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {company.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} PIAZZO. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/40 hover:text-white/70">
              Privacy
            </a>
            <a href="#" className="text-sm text-white/40 hover:text-white/70">
              Terms
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-white/70"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
