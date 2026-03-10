import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  'Online Shopping': [
    { label: 'Men', href: '/products?category=men' },
    { label: 'Women', href: '/products?category=women' },
    { label: 'Kids', href: '/products?category=kids' },
    { label: 'Home & Living', href: '/products?category=home-living' },
    { label: 'Beauty', href: '/products?category=beauty' },
    { label: 'Sport', href: '/products?category=sport' },
  ],
  'Customer Policies': [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'T&C', href: '/terms' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Track Orders', href: '/account/orders' },
    { label: 'Cancellation', href: '/cancellation' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
  'Useful Links': [
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Site Map', href: '/sitemap' },
    { label: 'Sell on Myntra', href: '/sell' },
  ],
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Newsletter */}
      <div className="bg-[#ff3f6c] py-8">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">Get Exclusive Offers</h3>
            <p className="text-pink-100 text-sm">Subscribe to our newsletter for the latest trends & deals</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 sm:w-72 px-4 py-2.5 rounded-md text-sm text-gray-900 outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-[#ff3f6c] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-pink-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-widest mb-4">myntra</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              India&apos;s leading online fashion and lifestyle destination. Shop the latest trends from top brands.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#ff3f6c] transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Link Sections */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-[#ff3f6c] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-10 pt-8 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Phone className="h-4 w-4 text-[#ff3f6c] shrink-0" />
            <span>1800-123-4567 (Toll Free)</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Mail className="h-4 w-4 text-[#ff3f6c] shrink-0" />
            <span>support@myntra.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <MapPin className="h-4 w-4 text-[#ff3f6c] shrink-0" />
            <span>Bengaluru, Karnataka, India</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Myntra Designs Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Secured payments by</span>
            <div className="flex gap-1">
              {['Visa', 'Mastercard', 'UPI', 'PayPal'].map((method) => (
                <span key={method} className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 text-xs">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
