import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Linkedin, Instagram, 
  Mail, Phone, MapPin, Activity
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-xl leading-none">C</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight">CarePulse</span>
            </Link>
            <p className="text-slate-400 leading-relaxed font-medium">
              Transforming healthcare through AI-driven intelligence. We empower clinics with the tools to deliver superior patient care and operational excellence.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/product" label="Product" />
              <FooterLink to="/pricing" label="Pricing" />
              <FooterLink to="/solutions" label="Solutions" />
              <FooterLink to="/resources" label="Resources" />
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <span className="font-medium">123 Health Tech Lane, Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <span className="font-medium">+1 (555) 800-CARE</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <span className="font-medium">hello@carepulse.ai</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/CTA */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              Get the latest updates on medical AI and clinic management.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-medium text-slate-500">
            © {currentYear} CarePulse AI Clinic. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="font-bold text-slate-400 hover:text-blue-500 transition-all flex items-center gap-2 group">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
