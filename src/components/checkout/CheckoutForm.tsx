import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(10, 'Please enter your full address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Invalid ZIP code'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { clearCart, total } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success message
      clearCart();
      toast.success('Order placed successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
          <input
            {...register('firstName')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
          <input
            {...register('phone')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Address</label>
          <input
            {...register('address')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">City</label>
          <input
            {...register('city')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="New York"
          />
          {errors.city && (
            <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">State</label>
          <input
            {...register('state')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="NY"
          />
          {errors.state && (
            <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
          <input
            {...register('zipCode')}
            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2"
            placeholder="12345"
          />
          {errors.zipCode && (
            <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between text-lg font-semibold mb-6">
          <span>Total Amount:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
}