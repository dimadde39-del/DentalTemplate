"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle2, ChevronDown, MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SiteConfig } from "@/config/site";
import { createBrowserClient } from "@/lib/supabase-browser";

const bookingFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя, чтобы мы знали, как к вам обращаться.")
    .max(100, "Имя слишком длинное."),
  phone: z
    .string()
    .trim()
    .min(10, "Укажите номер телефона для связи.")
    .max(30, "Номер телефона слишком длинный."),
  service: z.string().trim().min(1, "Выберите услугу."),
  message: z
    .string()
    .trim()
    .max(500, "Сообщение должно быть короче 500 символов.")
    .optional()
    .or(z.literal("")),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  readonly config: SiteConfig;
  readonly slug: string;
  readonly defaultService?: string;
  readonly variant?: "section" | "sheet";
  readonly title?: string;
  readonly subtitle?: string;
  readonly submitLabel?: string;
  readonly onSuccess?: () => void;
}

function getServiceOptions(config: SiteConfig): string[] {
  const uniqueNames = new Set(
    config.services
      .map((service) => service.name?.trim())
      .filter((service): service is string => Boolean(service))
  );

  const options = [...uniqueNames];
  return options.length > 0 ? options : ["Бесплатная консультация"];
}

function buildLeadServiceValue(service: string, message: string | undefined): string {
  const normalizedService = service.trim();
  const normalizedMessage = message?.trim();

  if (!normalizedMessage) {
    return normalizedService;
  }

  return `${normalizedService} | Сообщение: ${normalizedMessage}`;
}

const FIELD_CLASSNAME =
  "min-h-12 w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-[var(--color-primary)] focus:bg-foreground/[0.03]";

export function BookingForm({
  config,
  slug,
  defaultService,
  variant = "section",
  title = "Бесплатная консультация",
  subtitle = "Оставьте заявку, и администратор свяжется с вами, чтобы подобрать удобное время и уточнить детали.",
  submitLabel = "Оставить заявку",
  onSuccess,
}: BookingFormProps) {
  const supabase = createBrowserClient();
  const serviceOptions = getServiceOptions(config);
  const fallbackService = serviceOptions.length === 1 ? serviceOptions[0] : "";
  const resolvedDefaultService =
    defaultService?.trim() && serviceOptions.includes(defaultService.trim())
      ? defaultService.trim()
      : fallbackService;
  const isSheet = variant === "sheet";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const serviceMenuRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: resolvedDefaultService,
      message: "",
    },
  });

  const selectedService = watch("service");

  useEffect(() => {
    setValue("service", resolvedDefaultService, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [resolvedDefaultService, setValue]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!serviceMenuRef.current?.contains(event.target as Node)) {
        setIsServiceMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsServiceMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitError(null);
    setIsSuccess(false);

    const normalizedSlug = slug.trim();
    if (!normalizedSlug) {
      setSubmitError("Не удалось определить клинику. Обновите страницу и попробуйте ещё раз.");
      return;
    }

    const { error } = await supabase.rpc("insert_public_lead", {
      p_slug: normalizedSlug,
      p_name: values.name.trim(),
      p_phone: values.phone.trim(),
      p_service: buildLeadServiceValue(values.service, values.message),
    });

    if (error) {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp.");
      return;
    }

    setIsSuccess(true);
    setIsServiceMenuOpen(false);
    reset({
      name: "",
      phone: "",
      service: resolvedDefaultService,
      message: "",
    });
    onSuccess?.();
  };

  const formCard = (
    <div className="overflow-hidden rounded-[28px] border border-foreground/8 bg-foreground/[0.04] ring-1 ring-foreground/5">
      <div className="relative px-5 py-6 sm:px-6 sm:py-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/70 to-transparent" />

        {isSuccess ? (
          <div className="flex min-h-[20rem] flex-col items-start justify-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.04em] text-foreground">
              Спасибо! Мы свяжемся с вами в ближайшее время
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/70 sm:text-base">
              Заявка уже передана администратору клиники. Если вопрос срочный, вы также можете написать в WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label htmlFor="booking-name" className="text-sm font-medium text-foreground/80">
                Имя
              </label>
              <input
                id="booking-name"
                {...register("name")}
                type="text"
                autoComplete="name"
                placeholder="Как к вам обращаться"
                className={FIELD_CLASSNAME}
              />
              {errors.name ? (
                <p className="text-sm leading-6 text-foreground/72">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="booking-phone" className="text-sm font-medium text-foreground/80">
                Телефон
              </label>
              <input
                id="booking-phone"
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+7 707 000 00 00"
                className={FIELD_CLASSNAME}
              />
              {errors.phone ? (
                <p className="text-sm leading-6 text-foreground/72">{errors.phone.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="booking-service" className="text-sm font-medium text-foreground/80">
                Услуга
              </label>
              <input type="hidden" {...register("service")} />
              <div ref={serviceMenuRef} className="relative">
                <button
                  id="booking-service"
                  type="button"
                  aria-expanded={isServiceMenuOpen}
                  aria-haspopup="listbox"
                  onClick={() => setIsServiceMenuOpen((open) => !open)}
                  className={`${FIELD_CLASSNAME} flex items-center justify-between text-left`}
                >
                  <span className={selectedService ? "text-foreground" : "text-foreground/45"}>
                    {selectedService || "Выберите услугу"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-foreground/45 transition-transform ${
                      isServiceMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isServiceMenuOpen ? (
                  <div
                    role="listbox"
                    className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-foreground/10 bg-background p-2 text-foreground shadow-[0_24px_60px_color-mix(in_oklab,var(--color-primary)_12%,transparent)] ring-1 ring-foreground/5"
                  >
                    {serviceOptions.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          setValue("service", service, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          setIsServiceMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-foreground/[0.05]"
                      >
                        <span>{service}</span>
                        {selectedService === service ? (
                          <Check className="h-4 w-4 text-[var(--color-primary)]" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              {errors.service ? (
                <p className="text-sm leading-6 text-foreground/72">{errors.service.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="booking-message"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80"
              >
                <MessageSquareText className="h-4 w-4 text-[var(--color-primary)]" />
                <span>Сообщение, если хотите уточнить детали</span>
              </label>
              <textarea
                id="booking-message"
                {...register("message")}
                rows={4}
                placeholder="Например: удобное время, вопрос по имплантации или пожелание по врачу"
                className={FIELD_CLASSNAME}
              />
              {errors.message ? (
                <p className="text-sm leading-6 text-foreground/72">{errors.message.message}</p>
              ) : null}
            </div>

            {submitError ? (
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm leading-6 text-foreground">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-white shadow-[0_14px_36px_color-mix(in_oklab,var(--color-primary)_26%,transparent)] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Отправляем заявку..." : submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  if (isSheet) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]/82">
            {title}
          </p>
          <h3 className="mt-3 text-2xl font-black leading-[1.02] tracking-[-0.04em] text-foreground">
            Оставьте заявку без звонка
          </h3>
          <p className="mt-3 text-sm leading-6 text-foreground/72">{subtitle}</p>
        </div>
        {formCard}
      </div>
    );
  }

  return (
    <section id="booking-form" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.92fr)] lg:items-start">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]/82">
              {title}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[0.98] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
              Оставьте заявку, и мы свяжемся с вами
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/72 sm:text-lg">
              {subtitle}
            </p>
          </div>

          {formCard}
        </div>
      </div>
    </section>
  );
}
