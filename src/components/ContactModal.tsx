import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Clock, Send, CheckCircle, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080b12] border border-blue-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 text-left relative shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 pt-2">
          <h2 className="text-3xl font-extrabold text-white">
            Get in Touch with KorvenzaTech
          </h2>
          <p className="text-sm text-slate-300">
            Have a question or looking to start a technical project? Our team is available 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Department Emails & Hours */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider">Department Inquiries:</h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                  <span>General & Sales:</span>
                </div>
                <div className="font-mono text-violet-300">info@korvenzatech.com</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Technical Support:</span>
                </div>
                <div className="font-mono text-violet-300">support@korvenzatech.com</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Business Operations:</span>
                </div>
                <div>Monday – Friday, 24/7 Global Response</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NDA & Privacy Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All communications are confidential. We respect client intellectual property.
              </p>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider">Send Direct Message:</h3>

            {isSent ? (
              <div className="p-6 rounded-2xl bg-violet-950/40 border border-violet-400/30 text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-violet-400 mx-auto" />
                <div className="text-sm font-bold text-white">Message Sent</div>
                <p className="text-xs text-slate-300">Our support team will reply within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
                <textarea
                  rows={4}
                  required
                  placeholder="How can KorvenzaTech assist you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
