import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
interface PropsAlert {
    message: string,
    type: 'success' | 'error',
    isVisible: boolean,
    onClose: () => void,
    duration: number
}
// const [alert, setAlert] = useState(null);

// // להציג התראת הצלחה:
// setAlert({ message: 'פעולה בוצעה בהצלחה!', type: 'success' });

// // להציג התראת שגיאה:
// setAlert({ message: 'אירעה שגיאה', type: 'error' });`}
//             </pre>
//           </div>
//         </div>
//       </div>

//       {/* Render all alerts */}
//       {alerts.map(alert => (
//         <Alert
//           key={alert.id}
//           message={alert.message}
//           type={alert.type}
//           isVisible={alert.isVisible}
//           onClose={() => hideAlert(alert.id)}
//           duration={3000}
//         />
//       ))}
const MyAlert = ({ message, type = 'success', isVisible, onClose, duration = 3000 }: PropsAlert) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const alertConfig = {
        success: {
            icon: CheckCircle,
            bgGradient: 'from-slate-900/95 to-slate-800/95',
            borderColor: 'border-emerald-400/20',
            iconColor: 'text-emerald-400',
            textColor: 'text-emerald-100',
            shadowColor: 'shadow-emerald-500/30'
        },
        error: {
            icon: XCircle,
            bgGradient: 'from-slate-900/95 to-slate-800/95',
            borderColor: 'border-red-400/20',
            iconColor: 'text-red-400',
            textColor: 'text-red-100',
            shadowColor: 'shadow-red-500/30'
        }
    };

    const config = alertConfig[type];
    const IconComponent = config.icon;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className={`
        relative overflow-hidden
        bg-gradient-to-r ${config.bgGradient}
        backdrop-blur-lg
        border ${config.borderColor}
        rounded-2xl
        p-4 pr-12
        min-w-80 max-w-md
        shadow-2xl ${config.shadowColor}
        transform transition-all duration-500 ease-out
        animate-pulse-glow
      `}>
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-shimmer"></div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress"></div>

                <div className="relative flex items-center gap-3">
                    {/* Animated icon */}
                    <div className="relative">
                        <div className={`absolute inset-0 ${config.iconColor} opacity-20 animate-ping rounded-full`}></div>
                        <IconComponent className={`w-6 h-6 ${config.iconColor} relative z-10 animate-bounce-gentle`} />
                    </div>

                    {/* Message */}
                    <p className={`${config.textColor} font-medium flex-1 leading-relaxed`}>
                        {message}
                    </p>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={`
              absolute top-3 right-3
              ${config.textColor} hover:text-white
              transition-colors duration-200
              hover:bg-white/5 rounded-full p-1
            `}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default MyAlert