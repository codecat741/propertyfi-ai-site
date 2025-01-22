import { Toast } from "@/components/ui/toast"

type ToastProps = React.ComponentProps<typeof Toast>

export function useToast() {
  return {
    toast: ({ title, description }: { title: string; description?: string }) => {
      // For now, we'll just console.log the toast message
      // In a real app, this would show a toast notification
      console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`);
    }
  }
}