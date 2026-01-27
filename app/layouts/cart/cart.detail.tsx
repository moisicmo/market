import { Button, SelectCustom } from "@/components"
import { useAuthStore, useCartStore, useCustomerStore, useForm, usePaymentStore } from "@/hooks";
import { formCartInit, formCartValidations, type CartRequest } from "@/models";
import { useEffect, useState, type FormEvent } from "react";

interface Props {
  onClose: () => void;
}

export const CartDetail = (props: Props) => {
  const {
    onClose,
  } = props;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { branchSelect } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const { sentPayments } = usePaymentStore();
  const { dataCustomer, getCustomers } = useCustomerStore();

  const {
    customer,
    isFormValid,
    onResetForm,
    customerValid,
    onValueChange,
  } = useForm(formCartInit, formCartValidations);

  const sendSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    console.log('pagando');
    const request: CartRequest = {
      customerId: customer?.user.id!,
      branchId: `${branchSelect?.id}`,
      amount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      outputs: cart.map(cart => ({
        productId: cart.productModel.id,
        quantity: cart.quantity,
        price: cart.price
      }))
    }
    sentPayments(request);
    clearCart();
    onResetForm();
    onClose();
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div>
      <form onSubmit={sendSubmit} className="space-y-4">
        <SelectCustom
          label="Cliente"
          options={dataCustomer.data?.map((customer) => ({ id: customer.user.id, value: customer.user.name })) ?? []}
          selected={customer ? { id: customer.user.id, value: customer.user.name } : null}
          onSelect={(value) => {
            if (value && !Array.isArray(value)) {
              const selectedCustomer = dataCustomer.data?.find((c) => c.user.id === value.id);
              onValueChange('customer', selectedCustomer);
            }
          }}
          error={!!customerValid && formSubmitted}
          helperText={formSubmitted ? customerValid : ''}
        />

        <Button type="submit">
          Pagar
        </Button>
      </form>


    </div>
  )
}
