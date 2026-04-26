import { X, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { PaymentSetup } from '../modules/PaymentSetup'
import { Mobility } from '../modules/Mobility'
import { Connectivity } from '../modules/Connectivity'
import { Robotaxi } from '../modules/Robotaxi'
import { DroneDelivery } from '../modules/DroneDelivery'
import { AiConcierge } from '../modules/AiConcierge'
import { AiPlanner } from '../modules/AiPlanner'
import { AiResult } from '../modules/AiResult'
import { ArDecoder } from '../modules/ArDecoder'
import { BookingService } from '../modules/BookingService'
import { PassClaim } from '../modules/PassClaim'
import { PassRedeem } from '../modules/PassRedeem'
import { RouteDirections } from '../modules/RouteDirections'
import { LanguageSettings } from '../modules/LanguageSettings'
import { AnalyticsFunnel } from '../modules/AnalyticsFunnel'
import { ReleaseGate } from '../modules/ReleaseGate'
import { PaymentResult } from '../modules/PaymentResult'
import { RobotExperience } from '../modules/RobotExperience'
import { MetaverseExperience } from '../modules/MetaverseExperience'
import { MyOrders } from '../modules/MyOrders'
import { SpotDetail } from './SpotDetail'
import { getSpotById } from '../hooks/useSpot'
import { getLocaleText } from '../utils/locale'

const moduleMap: Record<string, { titleKey: string; component: React.FC }> = {
  'payment-setup': { titleKey: 'pay-mod-title', component: PaymentSetup },
  'mobility': { titleKey: 'mob-mod-title', component: Mobility },
  'connectivity': { titleKey: 'conn-mod-title', component: Connectivity },
  'robotaxi': { titleKey: 'robo-mod-title', component: Robotaxi },
  'drone-delivery': { titleKey: 'drone-mod-title', component: DroneDelivery },
  'ai-planner': { titleKey: 'ai-planner-mod-title', component: AiPlanner },
  'ai-concierge': { titleKey: 'ai-concierge-mod-title', component: AiConcierge },
  'ai-result': { titleKey: 'ai-planner-mod-title', component: AiResult },
  'ar-decoder': { titleKey: 'ar-mod-title', component: ArDecoder },
  'booking-service': { titleKey: 'order-module-title', component: BookingService },
  'pass-claim': { titleKey: 'pass-module-title', component: PassClaim },
  'pass-redeem': { titleKey: 'redeem-module-title', component: PassRedeem },
  'route-directions': { titleKey: 'leader-btn-map', component: RouteDirections },
  'language-settings': { titleKey: 'lang-setting', component: LanguageSettings },
  'analytics-funnel': { titleKey: 'analytics-module-title', component: AnalyticsFunnel },
  'release-gate': { titleKey: 'qa-module-title', component: ReleaseGate },
  'payment-result': { titleKey: 'payment-result-module-title', component: PaymentResult },
  'robot-experience': { titleKey: 'robot-mod-title', component: RobotExperience },
  'metaverse': { titleKey: 'meta-mod-title', component: MetaverseExperience },
  'my-orders': { titleKey: 'my-orders-module-title', component: MyOrders },
}

export function Overlay() {
  const { t } = useTranslation()
  const currentModule = useUIStore((s) => s.currentModule)
  const currentSpotId = useUIStore((s) => s.currentSpotId)
  const moduleOriginSpotId = useUIStore((s) => s.moduleOriginSpotId)
  const closeModule = useUIStore((s) => s.closeModule)
  const goBackToSpot = useUIStore((s) => s.goBackToSpot)

  const isOpen = currentModule !== null || currentSpotId !== null
  const showBackBtn = currentModule !== null && moduleOriginSpotId !== null

  const moduleEntry = currentModule ? moduleMap[currentModule] : null
  let title = ''
  if (moduleEntry) {
    title = t(moduleEntry.titleKey)
  } else if (currentSpotId) {
    const spot = getSpotById(currentSpotId)
    title = spot ? `${getLocaleText(spot.title)} · ${t('leader-flow-short')}` : ''
  }
  const ModuleComponent = moduleEntry?.component

  return (
    <div
      className={`absolute inset-0 bg-slate-900 z-[100] transform transition-transform duration-300 flex flex-col ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {showBackBtn && (
            <button
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition hover:bg-slate-700 shrink-0"
              onClick={goBackToSpot}
            >
              <ArrowLeft className="w-4 h-4 text-slate-300" />
            </button>
          )}
          <h2 className="font-bold text-lg truncate">{title}</h2>
        </div>
        {!showBackBtn && (
          <button
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition hover:bg-slate-700 shrink-0"
            onClick={closeModule}
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        )}
      </div>
      <div
        className="flex-1 overflow-y-auto p-4 no-scrollbar"
        data-testid={currentSpotId ? 'spot-detail' : currentModule ? `module-${currentModule}` : 'overlay-content'}
      >
        {ModuleComponent ? (
          <ModuleComponent />
        ) : currentSpotId ? (
          <SpotDetail />
        ) : null}
      </div>
    </div>
  )
}
