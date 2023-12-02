import { Loader2 } from "lucide-react"
import { ButtonProps, Button } from "./button"

type LoadingButtonProps = {
    loading: boolean
} & ButtonProps

export default function LoadingButton({
    children,
    loading,
    ...props
}: LoadingButtonProps) {
    return (
        <Button {...props} disabled={props.disabled || loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {children}
        </Button>
    )
}