import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent 
        className="bg-popover border border-border shadow-lg" 
        sideOffset={16}
      >
        <p className="max-w-xs text-popover-foreground font-medium px-1 py-0.5">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);