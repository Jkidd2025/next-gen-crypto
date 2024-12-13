interface MobileOverlayProps {
  show: boolean;
  onClick: () => void;
}

export const MobileOverlay = ({ show, onClick }: MobileOverlayProps) => {
  if (!show) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-20"
      onClick={onClick}
    />
  );
};