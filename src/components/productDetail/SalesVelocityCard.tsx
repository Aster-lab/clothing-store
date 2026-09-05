import {Zap, TrendingUp, TrendingDown} from "lucide-react";
import {cn} from "@/lib/utils/tailwind"
import type { SalesVelocity } from "@/types/productdata";
import { salesVelocityStyles as styles, RISK_BADGE_STYLES } from "@/styles/productDetails";

interface SalesVelocityCardProps {
    salesVelocity: SalesVelocity;
    totalStock :number;
}

export function SalesVelocityCard({salesVelocity,totalStock}:SalesVelocityCardProps) {
   const risk = RISK_BADGE_STYLES[salesVelocity.stockLevel];

   return (
    <article className = {styles.card}>
        <header className = {styles.header}>
            <div className = {styles.titleGroup}>
                <h3 className = {styles.title}>Sales Velocity</h3>
            </div>
            <div className = {styles.iconWrapper}>
                <Zap className = {styles.icon}/>
            </div>
        </header>

        {/* Main Row */}
        <div className = {styles.mainMetricRow}>
            <div>
                <div className = {styles.valueGroup}>
                    <span className = {styles.value}>{salesVelocity.daily7d.toFixed(2)}</span>
                    <span className = {styles.unit}>/day</span>
                </div>
                <p className = {styles.subtitle}>7-day average</p>
            </div>
            <span className = {cn(styles.badgeBase,risk.style)}>{risk.label}</span>
        </div>
          
        <dl className={styles.grid}>
        <div className={styles.metricBlock}>
          <dt className={styles.metricLabel}>Days of Supply</dt>
          <dd className={styles.metricValue}>
            {salesVelocity.daysofReStock !== null ? `${salesVelocity.daysofReStock} Days Left` : "N/A"}
          </dd>
          <dd className={styles.metricMeta}>Based on {totalStock} total units</dd>
        </div>

        <div className={styles.metricBlock}>
          <dt className={styles.metricLabel}>Velocity Acceleration</dt>
            <dd className={styles.trendGroup}>
            {salesVelocity.trend > 0 ? (
              <>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className={styles.trendUp}>+{salesVelocity.trend}%</span>
              </>
            ) : salesVelocity.trend < 0 ? (
              <>
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                <span className={styles.trendDown}>{salesVelocity.trend}%</span>
              </>
            ) : (
              <span className={styles.trendNeutral}>0% (Stable)</span>
            )}
          </dd>
          <dd className={styles.metricMeta}>
            30d Baseline: {salesVelocity.daily7d} u/d
          </dd>
        </div>
      </dl>
    </article>
  );
}