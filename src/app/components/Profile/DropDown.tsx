import { useState } from "react";
import { ChevronDown, HelpCircle, LogOut01, Moon01, Plus, Settings01, User01 } from "@untitledui/icons";
import type { Selection } from "react-aria-components";
import { Button, SubmenuTrigger } from "react-aria-components";
import { FiMoreHorizontal } from 'react-icons/fi';
import { Dropdown } from "@/components/base/dropdown/dropdown";
export default function DropdownAccountButton() {
    const [selectedAccount, setSelectedAccount] = useState<Selection>(new Set(["olivia"]));
    const [selectedTheme, setSelectedTheme] = useState<Selection>(new Set(["light-mode"]));
      const handleSignOut=()=>{
         const storedUser = localStorage.getItem("currentUser");
         if (storedUser) {
            localStorage.removeItem("currentUser");
         }
            window.location.href = "/login";
      }
      const handleDelete=()=>{
        const userEmail = JSON.parse(localStorage.getItem("currentUser") || "{}").email;
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        if (userEmail) {
            // Remove the user from localStorage
            localStorage.removeItem("currentUser");
            localStorage.setItem("users", JSON.stringify(allUsers.filter((user: any) => user.email !== userEmail)));
            // Remove the user's recipes from localStorage
            const myRecipes = JSON.parse(localStorage.getItem("myRecipes") || "[]");
            const updatedRecipes = myRecipes.filter((recipe: any) => recipe.email !== userEmail);
            localStorage.setItem("myRecipes", JSON.stringify(updatedRecipes));
            // Redirect to login page or home page
            window.location.href = "/signup";
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