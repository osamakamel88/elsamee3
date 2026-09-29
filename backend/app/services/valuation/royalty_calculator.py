"""
Royalty & Legal Damages Valuation Engine for 'elsamee3' (السميع).
Calculates estimated multi-channel earnings, publishing splits (composers & lyricists),
and statutory damages benchmarks for music & intellectual property.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

# Dynamic currency conversion baselines (USD anchor)
CURRENCY_RATES = {
    "USD": 1.0,
    "EGP": 48.50,
    "SAR": 3.75,
    "AED": 3.67,
    "EUR": 0.92,
    "GBP": 0.78
}

# Platform Pay-Per-Stream (PPS) benchmarks
DSP_RATES = {
    "mena": {
        "apple_music": 0.0065,
        "spotify": 0.0028,
        "anghami": 0.0022,
        "deezer": 0.0025,
        "blended": 0.0032,
    },
    "global": {
        "apple_music": 0.0080,
        "spotify": 0.0038,
        "anghami": 0.0025,
        "deezer": 0.0035,
        "blended": 0.0048,
    }
}

# YouTube CPM & Monetization Ratios
YOUTUBE_METRICS = {
    "mena": {
        "cpm": 2.20,
        "monetized_rate": 0.45,  # 45% of views trigger ads
    },
    "global": {
        "cpm": 6.50,
        "monetized_rate": 0.60,  # 60% of views trigger ads
    }
}

# Sync Licensing Baseline (per commercial / TV sync use)
SYNC_BENCHMARKS = {
    "mena": 3500.0,
    "global": 12500.0
}

# Standard Rights Split Matrix (Industry Benchmark)
# Master: 70% (Producer/Label 35%, Performer 35%)
# Publishing: 30% (Composer 15%, Lyricist 15%)
ROLE_SPLITS = {
    "lyricist": {
        "label_en": "Lyricist / Poet (الشاعر)",
        "share_streaming": 0.15,
        "share_youtube": 0.15,
        "share_ugc": 0.20,
        "share_sync": 0.25,
        "share_settlement": 0.40,
    },
    "composer": {
        "label_en": "Composer / Melodist (الملحن)",
        "share_streaming": 0.15,
        "share_youtube": 0.15,
        "share_ugc": 0.20,
        "share_sync": 0.25,
        "share_settlement": 0.40,
    },
    "songwriter_both": {
        "label_en": "Composer & Lyricist (الملحن والشاعر معاً)",
        "share_streaming": 0.30,
        "share_youtube": 0.30,
        "share_ugc": 0.40,
        "share_sync": 0.50,
        "share_settlement": 0.80,
    },
    "performer": {
        "label_en": "Main Performer / Singer (المطرب/المؤدي)",
        "share_streaming": 0.35,
        "share_youtube": 0.35,
        "share_ugc": 0.30,
        "share_sync": 0.25,
        "share_settlement": 0.50,
    },
    "producer_label": {
        "label_en": "Producer / Record Label (المنتج / شركة الإنتاج)",
        "share_streaming": 0.35,
        "share_youtube": 0.35,
        "share_ugc": 0.30,
        "share_sync": 0.25,
        "share_settlement": 0.50,
    },
    "full_rights": {
        "label_en": "Full Rights Holder (كامل حقوق الماستر والمصنف)",
        "share_streaming": 1.0,
        "share_youtube": 1.0,
        "share_ugc": 1.0,
        "share_sync": 1.0,
        "share_settlement": 1.0,
    }
}

class ValuationRequest(BaseModel):
    work_title: str = Field(default="Untitled Artwork", description="Title of the musical or visual work")
    artist: str = Field(default="Artist", description="Artist or Creator name")
    role: str = Field(default="lyricist", description="Role of the claimant (lyricist, composer, songwriter_both, performer, full_rights)")
    youtube_views: int = Field(default=0, ge=0)
    spotify_streams: int = Field(default=0, ge=0)
    apple_music_streams: int = Field(default=0, ge=0)
    anghami_streams: int = Field(default=0, ge=0)
    deezer_streams: int = Field(default=0, ge=0)
    total_dsp_streams: Optional[int] = Field(default=None, ge=0)
    ugc_video_creations: int = Field(default=0, ge=0, description="TikTok & Reels user generated videos")
    sync_commercial_uses: int = Field(default=0, ge=0, description="TV series, commercial ad, or film sync instances")
    territory: str = Field(default="mena", description="'mena' or 'global'")
    infringement_type: str = Field(default="unauthorized_commercial", description="Type of infringement for damages calculation")
    currency: str = Field(default="USD", description="'USD', 'EGP', 'SAR', 'AED', 'EUR'")

class ValuationResponse(BaseModel):
    work_title: str
    artist: str
    role: str
    role_label: str
    territory: str
    currency: str
    currency_rate: float
    
    # Gross Platform Revenue (Before Splits)
    gross_youtube_usd: float
    gross_dsp_usd: float
    gross_ugc_usd: float
    gross_sync_usd: float
    total_gross_usd: float
    
    # Claimant Share Breakdown (In USD)
    claimant_youtube_usd: float
    claimant_dsp_usd: float
    claimant_ugc_usd: float
    claimant_sync_usd: float
    claimant_total_earnings_usd: float
    
    # Converted Amounts (Target Currency)
    total_gross_converted: float
    claimant_total_earnings_converted: float
    
    # Channel Breakdown (Converted)
    channel_breakdown_converted: Dict[str, float]
    
    # UGC Virality Assessment
    ugc_virality_tier: str
    ugc_virality_label_ar: str
    
    # Legal & Damages Claim Benchmark
    infringement_type: str
    actual_damages_converted: float
    willful_penalty_multiplier: float
    statutory_punitive_converted: float
    moral_harm_compensation_converted: float
    recommended_settlement_claim_converted: float
    max_litigation_demand_converted: float
    legal_basis_summary_ar: str
    legal_basis_summary_en: str


def calculate_ugc_payout(video_count: int) -> tuple[float, str, str]:
    """Calculates tiered micro-sync pool for TikTok & Reels virality."""
    if video_count <= 0:
        return 0.0, "None", "لا يوجد استخدام"
    elif video_count < 5000:
        return 150.0, "Emerging Audio", "انتشار مبدئي (أقل من 5 آلاف فيديو)"
    elif video_count < 25000:
        return 850.0, "Moderate Buzz", "رواج متوسط (5 إلى 25 ألف فيديو)"
    elif video_count < 100000:
        return 2750.0, "Trending Sound", "تريند نشط (25 إلى 100 ألف فيديو)"
    elif video_count < 500000:
        return 7500.0, "Viral Sensation", "انتشار فيروسي واسع (100 إلى 500 ألف فيديو)"
    else:
        # 500k+ gets base plus incremental per-video pool
        extra = (video_count - 500000) * 0.012
        return 12000.0 + extra, "Mega Phenomenon", "ظاهرة مليونية كبرى (أكثر من نصف مليون فيديو)"


def calculate_royalties_and_damages(req: ValuationRequest) -> ValuationResponse:
    terr = req.territory.lower() if req.territory.lower() in ("mena", "global") else "mena"
    curr = req.currency.upper() if req.currency.upper() in CURRENCY_RATES else "USD"
    fx = CURRENCY_RATES[curr]
    
    role_key = req.role if req.role in ROLE_SPLITS else "lyricist"
    role_info = ROLE_SPLITS[role_key]

    # 1. YouTube Revenue Calculation
    yt_conf = YOUTUBE_METRICS[terr]
    # YouTube Gross AdSense & Content ID: (Views / 1000) * CPM * Monetization Rate
    gross_youtube_usd = (req.youtube_views / 1000.0) * yt_conf["cpm"] * yt_conf["monetized_rate"]

    # 2. DSP Streaming Revenue Calculation
    dsp_conf = DSP_RATES[terr]
    if req.total_dsp_streams and req.total_dsp_streams > 0 and (req.spotify_streams + req.apple_music_streams + req.anghami_streams + req.deezer_streams) == 0:
        gross_dsp_usd = req.total_dsp_streams * dsp_conf["blended"]
    else:
        gross_dsp_usd = (
            (req.apple_music_streams * dsp_conf["apple_music"]) +
            (req.spotify_streams * dsp_conf["spotify"]) +
            (req.anghami_streams * dsp_conf["anghami"]) +
            (req.deezer_streams * dsp_conf["deezer"])
        )
        # If user also provided total_dsp_streams higher than individual breakdown, compute remainder
        sum_individual = req.apple_music_streams + req.spotify_streams + req.anghami_streams + req.deezer_streams
        if req.total_dsp_streams and req.total_dsp_streams > sum_individual:
            remainder = req.total_dsp_streams - sum_individual
            gross_dsp_usd += remainder * dsp_conf["blended"]

    # 3. UGC Virality Calculation (TikTok / Reels)
    gross_ugc_usd, ugc_tier, ugc_tier_ar = calculate_ugc_payout(req.ugc_video_creations)

    # 4. Sync & Commercial Exploitation
    sync_benchmark = SYNC_BENCHMARKS[terr]
    gross_sync_usd = req.sync_commercial_uses * sync_benchmark

    # Total Gross Industry Pool
    total_gross_usd = gross_youtube_usd + gross_dsp_usd + gross_ugc_usd + gross_sync_usd

    # 5. Claimant Specific Net Royalties
    claimant_youtube_usd = gross_youtube_usd * role_info["share_youtube"]
    claimant_dsp_usd = gross_dsp_usd * role_info["share_streaming"]
    claimant_ugc_usd = gross_ugc_usd * role_info["share_ugc"]
    claimant_sync_usd = gross_sync_usd * role_info["share_sync"]
    claimant_total_earnings_usd = claimant_youtube_usd + claimant_dsp_usd + claimant_ugc_usd + claimant_sync_usd

    # Converted Amounts
    total_gross_converted = round(total_gross_usd * fx, 2)
    claimant_total_earnings_converted = round(claimant_total_earnings_usd * fx, 2)

    channel_breakdown_converted = {
        "youtube": round(claimant_youtube_usd * fx, 2),
        "dsp_streaming": round(claimant_dsp_usd * fx, 2),
        "ugc_social": round(claimant_ugc_usd * fx, 2),
        "sync_commercial": round(claimant_sync_usd * fx, 2)
    }

    # 6. Legal Settlement & Damages Claim Estimation
    # Under Egyptian Law 82/2002 and US DMCA 17 U.S.C. 504:
    # Actual damages + Infringer profits disgorgement + Willful statutory multiplier + Moral harm
    severity_multipliers = {
        "uncredited_stream": (1.3, 800.0),            # Low-commercial accidental infringement
        "derivative_sample": (2.2, 1800.0),           # Stolen melody / sample interpolation
        "unauthorized_commercial": (2.8, 3000.0),     # Used in commercial campaign/ad without license
        "willful_theft": (3.8, 5000.0)                # Complete deliberate cloning/stealing
    }
    
    mult, moral_base_usd = severity_multipliers.get(req.infringement_type, (2.5, 2500.0))
    
    # Claimant's actual commercial loss
    actual_damages_usd = claimant_total_earnings_usd
    # Statutory punitive compensation for intentional exploitation
    statutory_punitive_usd = actual_damages_usd * (mult - 1.0)
    # Moral harm & author's reputational injury (الحق الأدبي للمؤلف والملحن)
    moral_harm_usd = moral_base_usd if (req.youtube_views > 10000 or req.ugc_video_creations > 500 or req.sync_commercial_uses > 0) else 500.0

    # Settlement claim: Actual damages + Punitive component + Moral harm
    rec_settlement_usd = (actual_damages_usd * mult) + moral_harm_usd
    # Max court litigation demand benchmark (2.0x of friendly settlement)
    max_demand_usd = rec_settlement_usd * 2.1

    actual_damages_converted = round(actual_damages_usd * fx, 2)
    statutory_punitive_converted = round(statutory_punitive_usd * fx, 2)
    moral_harm_compensation_converted = round(moral_harm_usd * fx, 2)
    recommended_settlement_claim_converted = round(rec_settlement_usd * fx, 2)
    max_litigation_demand_converted = round(max_demand_usd * fx, 2)

    legal_basis_ar = (
        f"المطالبة مؤسسة طبقاً لنصوص المواد (138، 139، 181) من قانون حماية الملكية الفكرية المصري رقم 82 لسنة 2002 "
        f"واتفاقية برن الدولية، والتي تقضي بحق المؤلف والملحن في استرداد كافة الأرباح المحققة مع التعويض عن الضررين المادي والأدبي "
        f"بمعامل تعويض {mult}x للاستغلال التجاري بدون ترخيص كتابي مسبق."
    )
    legal_basis_en = (
        f"Statutory claim grounded in Berne Convention Article 9 and 17 U.S.C. § 504 principles: "
        f"disgorgement of infringer gross profits, recovery of licensing revenue ({mult}x willful multiplier), "
        f"and compensation for infringement of the author's statutory moral and economic rights."
    )

    return ValuationResponse(
        work_title=req.work_title,
        artist=req.artist,
        role=role_key,
        role_label=role_info["label_en"],
        territory=terr,
        currency=curr,
        currency_rate=fx,
        gross_youtube_usd=round(gross_youtube_usd, 2),
        gross_dsp_usd=round(gross_dsp_usd, 2),
        gross_ugc_usd=round(gross_ugc_usd, 2),
        gross_sync_usd=round(gross_sync_usd, 2),
        total_gross_usd=round(total_gross_usd, 2),
        claimant_youtube_usd=round(claimant_youtube_usd, 2),
        claimant_dsp_usd=round(claimant_dsp_usd, 2),
        claimant_ugc_usd=round(claimant_ugc_usd, 2),
        claimant_sync_usd=round(claimant_sync_usd, 2),
        claimant_total_earnings_usd=round(claimant_total_earnings_usd, 2),
        total_gross_converted=total_gross_converted,
        claimant_total_earnings_converted=claimant_total_earnings_converted,
        channel_breakdown_converted=channel_breakdown_converted,
        ugc_virality_tier=ugc_tier,
        ugc_virality_label_ar=ugc_tier_ar,
        infringement_type=req.infringement_type,
        actual_damages_converted=actual_damages_converted,
        willful_penalty_multiplier=mult,
        statutory_punitive_converted=statutory_punitive_converted,
        moral_harm_compensation_converted=moral_harm_compensation_converted,
        recommended_settlement_claim_converted=recommended_settlement_claim_converted,
        max_litigation_demand_converted=max_litigation_demand_converted,
        legal_basis_summary_ar=legal_basis_ar,
        legal_basis_summary_en=legal_basis_en
    )
