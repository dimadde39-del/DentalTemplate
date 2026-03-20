import { Clock3, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { SiteConfig } from "@/config/site";

interface FinalContactCTAProps {
  readonly config: SiteConfig;
}

type ExtendedContactConfig = SiteConfig & {
  readonly address?: string | null;
  readonly hours?: string | null;
};

function getTrimmedValue(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toTelHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized}`;
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function FinalContactCTA({ config }: FinalContactCTAProps) {
  const extendedConfig = config as ExtendedContactConfig;
  const phone = getTrimmedValue(config.contactPhone);
  const email = getTrimmedValue(config.contactEmail);
  const address = getTrimmedValue(extendedConfig.address);
  const hours = getTrimmedValue(extendedConfig.hours);

  if (!phone) return null;

  return (
    <section id="contact" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-foreground/8 bg-foreground/[0.04] ring-1 ring-white/5">
          <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/70 to-transparent" />
            <div className="absolute right-[-10%] top-[-12%] h-40 w-40 rounded-full bg-[var(--color-primary)]/12 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.95fr)] lg:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]/82">
                  Бесплатная консультация
                </p>
                <h2 className="mt-3 max-w-[12ch] text-3xl font-black leading-[0.98] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
                  Обсудим лечение и подскажем следующий шаг
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/72 sm:text-lg">
                  Свяжитесь с клиникой удобным способом. Быстрый ответ в WhatsApp и запись на
                  бесплатную консультацию без лишних ожиданий.
                </p>

                <div className="mt-8">
                  <a
                    href={toTelHref(phone)}
                    className="inline-flex items-center gap-3 text-[1.9rem] font-black leading-none tracking-[-0.05em] text-foreground transition-colors hover:text-[var(--color-primary)] sm:text-[2.4rem]"
                  >
                    <PhoneCall className="h-6 w-6 shrink-0 text-[var(--color-primary)]" />
                    <span>{phone}</span>
                  </a>
                </div>
              </div>

              <div className="relative rounded-[28px] border border-foreground/8 bg-black/[0.12] p-5 ring-1 ring-white/5 sm:p-6">
                <a
                  href={toWhatsAppHref(phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-white shadow-[0_14px_36px_color-mix(in_oklab,var(--color-primary)_28%,transparent)] transition-colors"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span>Записаться в WhatsApp</span>
                </a>

                <div className="mt-5 space-y-3 text-sm leading-6 text-foreground/72">
                  {email ? (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      <a
                        href={`mailto:${email}`}
                        className="transition-colors hover:text-foreground"
                      >
                        {email}
                      </a>
                    </div>
                  ) : null}

                  {address ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      <span>{address}</span>
                    </div>
                  ) : null}

                  {hours ? (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      <span>{hours}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
