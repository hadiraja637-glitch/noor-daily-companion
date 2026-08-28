<header
  className="
    w-full
    min-h-[150px]
    px-6
    md:px-12
    lg:px-16
    flex
    items-center
    justify-between
    gap-10
    bg-[#061F1B]
    border-b
    border-[#B99A4A]/30
  "
>
  {/* Brand */}
  <div className="flex items-center gap-5">
    <div className="w-[76px] h-[88px] shrink-0">
      <NoorLogo size={76} />
    </div>

    <div>
      <h1 className="text-[60px] text-[#F3EEE2] font-serif leading-none">
        Noor
      </h1>

      <p className="mt-2 text-[11px] tracking-[0.28em] uppercase text-[#C9A85A]">
        Islamic Daily Companion
      </p>
    </div>
  </div>

  {/* Tagline */}
  <div className="hidden lg:block max-w-[430px]">
    <p className="text-[17px] leading-relaxed text-[#AEB5B4]">
      Your daily companion for prayer,
      remembrance and spiritual growth.
    </p>
  </div>
</header>
