import { Menu as MenuIcon, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Menu = () => {
  const menuItems = [
    "Our Story",
    "Tokenomics",
    "Community",
    "Contact Us"
  ];

  return (
    <>
      {/* Mobile Menu */}
      <div className="fixed top-4 left-4 md:hidden z-50">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <MenuIcon className="h-6 w-6 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="fixed top-0 -left-12 w-[25vw] min-w-72 h-[100vh] bg-white p-6 animate-slide-in-left data-[state=closed]:animate-slide-out-left">
            {({ close }) => (
              <>
                <div className="flex justify-end mb-6">
                  <X 
                    className="h-6 w-6 text-black cursor-pointer" 
                    onClick={() => close()}
                  />
                </div>
                <div className="flex flex-col gap-8">
                  {menuItems.map((item) => (
                    <DropdownMenuItem key={item} className="cursor-pointer text-xl py-4 text-black hover:text-primary transition-colors">
                      {item}
                    </DropdownMenuItem>
                  ))}
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex fixed top-8 left-0 right-0 justify-center gap-12 z-50">
        {menuItems.map((item) => (
          <button
            key={item}
            className="text-white hover:text-white/80 transition-colors text-lg font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
};