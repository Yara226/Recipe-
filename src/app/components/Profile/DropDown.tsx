import { useState } from "react";
import { ChevronDown, HelpCircle, LogOut01, Moon01, Plus, Settings01, User01 } from "@untitledui/icons";
import type { Selection } from "react-aria-components";
import { Button, SubmenuTrigger } from "react-aria-components";
import { FiMoreHorizontal } from 'react-icons/fi';
import { Dropdown } from "@/components/base/dropdown/dropdown";
import toast from "react-hot-toast";
export default function DropdownAccountButton() {
    const [selectedAccount, setSelectedAccount] = useState<Selection>(new Set(["olivia"]));
    const [selectedTheme, setSelectedTheme] = useState<Selection>(new Set(["light-mode"]));
        const handleSignOut=async ()=>{
            await fetch('/api/auth/logout', { method: 'POST' });
                        toast.success("تم تسجيل الخروج");
            window.location.href = "/login";
      }
        const handleDelete=async ()=>{
          const response = await fetch('/api/auth/delete', { method: 'DELETE' });
                    if (response.ok) {
                        toast.success("تم حذف الحساب بنجاح");
                        window.location.href = "/signup";
                    } else {
                        toast.error("تعذر حذف الحساب");
                    }
      }
    return (
       <Dropdown.Root>
        <Dropdown.DotsButton />
 
        <Dropdown.Popover className="w-25">
            <Dropdown.Menu>
               
                <Dropdown.Separator />
                <Dropdown.Section>
                    <Dropdown.Item onClick={handleSignOut} className="text-red-500">
                        Sign Out
                    </Dropdown.Item>
                    <Dropdown.Item className="text-black" onClick={handleDelete}>
                        Delete Account
                    </Dropdown.Item>
                </Dropdown.Section>
                <Dropdown.Separator />
                <Dropdown.Section>
                    
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
    );
};