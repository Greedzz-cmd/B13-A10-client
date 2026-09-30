"use client";

import { Button, AlertDialog } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

/**
 * Themed confirmation for destructive admin actions.
 *
 * This replaces window.confirm(), which renders in browser chrome and so can
 * never match the app palette: it stays light in dark mode and ignores
 * data-theme entirely. AlertDialog draws from the same HeroUI styles as the
 * rest of the UI, so it follows the theme switch for free.
 *
 * `onConfirm` is kept separate from `onOpenChange` on purpose. Routing both
 * through onOpenChange means a cancel has to be distinguished from a confirm
 * by its boolean argument, and a handler that early-returns on `false` leaves
 * the dialog open forever.
 */
export function ConfirmDialog({
    isOpen,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel = "Cancel",
    isPending = false,
}) {
    return (
        <AlertDialog.Root isOpen={isOpen} onOpenChange={onOpenChange}>
            <AlertDialog.Backdrop>
                <AlertDialog.Container placement="center">
                    <AlertDialog.Dialog>
                        <AlertDialog.Header>
                            <AlertDialog.Icon status="danger">
                                <AlertTriangle className="size-5" />
                            </AlertDialog.Icon>
                            <AlertDialog.Heading>{title}</AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>{description}</AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button
                                variant="tertiary"
                                onPress={() => onOpenChange(false)}
                                isDisabled={isPending}
                            >
                                {cancelLabel}
                            </Button>
                            <Button
                                variant="danger"
                                onPress={onConfirm}
                                isPending={isPending}
                            >
                                {confirmLabel}
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog.Root>
    );
}
