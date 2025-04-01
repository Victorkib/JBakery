'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const OrderForm = ({ order, onSubmit, onCancel, theme }) => {
  const initialOrderState = {
    customer: {
      name: '',
      email: '',
      phone: '',
    },
    items: [{ name: '', quantity: 1, price: 0 }],
    paymentMethod: 'card',
    deliveryAddress: '',
    deliveryDate: '',
    specialInstructions: '',
  };

  const [formData, setFormData] = useState(order || initialOrderState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      // Format the deliveryDate for the datetime-local input
      const formattedOrder = {
        ...order,
        deliveryDate: formatDateForInput(order.deliveryDate),
      };
      setFormData(formattedOrder);
    }
  }, [order]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      customer: {
        ...formData.customer,
        [name]: value,
      },
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]:
        field === 'quantity' || field === 'price'
          ? Number.parseFloat(value) || 0
          : value,
    };
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return; // Keep at least one item
    }
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate customer info
    if (!formData.customer.name)
      newErrors.customerName = 'Customer name is required';
    if (!formData.customer.email) newErrors.customerEmail = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.customer.email))
      newErrors.customerEmail = 'Invalid email format';
    if (!formData.customer.phone)
      newErrors.customerPhone = 'Phone number is required';

    // Validate items
    const itemErrors = [];
    formData.items.forEach((item, index) => {
      const itemError = {};
      if (!item.name) itemError.name = 'Item name is required';
      if (item.quantity <= 0)
        itemError.quantity = 'Quantity must be greater than 0';
      if (item.price <= 0) itemError.price = 'Price must be greater than 0';
      if (Object.keys(itemError).length > 0) itemErrors[index] = itemError;
    });
    if (itemErrors.length > 0) newErrors.items = itemErrors;

    // Validate delivery info
    if (!formData.deliveryAddress)
      newErrors.deliveryAddress = 'Delivery address is required';
    if (!formData.deliveryDate)
      newErrors.deliveryDate = 'Delivery date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Calculate the total
    const total = calculateTotal();

    // Prepare the data for submission
    const submissionData = {
      ...formData,
      total,
      status: order ? order.status : 'pending', // Default to pending for new orders
      date: order ? order.date : new Date().toISOString(), // Use current date for new orders
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3
          className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.customer.name}
              onChange={handleCustomerChange}
              className={`mt-1 block w-full rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } shadow-sm`}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
            )}
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.customer.email}
              onChange={handleCustomerChange}
              className={`mt-1 block w-full rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } shadow-sm`}
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-500">
                {errors.customerEmail}
              </p>
            )}
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.customer.phone}
              onChange={handleCustomerChange}
              className={`mt-1 block w-full rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } shadow-sm`}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.customerPhone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3
            className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Order Items
          </h3>
          <button
            type="button"
            onClick={addItem}
            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
              theme === 'dark'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Plus size={16} className="mr-1" />
            Add Item
          </button>
        </div>

        {formData.items.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-md ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between mb-2">
              <h4
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Item {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className={`text-sm ${
                  theme === 'dark'
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-600 hover:text-red-800'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Item Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, 'name', e.target.value)
                  }
                  className={`mt-1 block w-full rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                      : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                  } shadow-sm`}
                />
                {errors.items &&
                  errors.items[index] &&
                  errors.items[index].name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.items[index].name}
                    </p>
                  )}
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Quantity
                </label>
                <div className="flex mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleItemChange(
                        index,
                        'quantity',
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className={`px-3 py-2 rounded-l-md border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        'quantity',
                        Number.parseInt(e.target.value) || 1
                      )
                    }
                    className={`block w-full text-center ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                        : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                    } shadow-sm`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleItemChange(index, 'quantity', item.quantity + 1)
                    }
                    className={`px-3 py-2 rounded-r-md border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {errors.items &&
                  errors.items[index] &&
                  errors.items[index].quantity && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.items[index].quantity}
                    </p>
                  )}
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      'price',
                      Number.parseFloat(e.target.value) || 0
                    )
                  }
                  className={`mt-1 block w-full rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                      : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                  } shadow-sm`}
                />
                {errors.items &&
                  errors.items[index] &&
                  errors.items[index].price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.items[index].price}
                    </p>
                  )}
              </div>
            </div>
            <div
              className={`mt-2 text-right font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Subtotal: ${(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}

        <div
          className={`text-right font-bold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Total: ${calculateTotal().toFixed(2)}
        </div>
      </div>

      <div className="space-y-4">
        <h3
          className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Delivery Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Delivery Address
            </label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) =>
                setFormData({ ...formData, deliveryAddress: e.target.value })
              }
              className={`mt-1 block w-full rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } shadow-sm`}
              placeholder="Enter address or 'Pickup in store'"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors.deliveryAddress}
              </p>
            )}
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Delivery Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData({ ...formData, deliveryDate: e.target.value })
              }
              className={`mt-1 block w-full rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } shadow-sm`}
            />
            {errors.deliveryDate && (
              <p className="mt-1 text-sm text-red-500">{errors.deliveryDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3
          className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Payment Method
        </h3>
        <div className="flex space-x-4">
          <label
            className={`inline-flex items-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className={`${
                theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
              } focus:ring-amber-500`}
            />
            <span className="ml-2">Card</span>
          </label>
          <label
            className={`inline-flex items-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="mpesa"
              checked={formData.paymentMethod === 'mpesa'}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className={`${
                theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
              } focus:ring-amber-500`}
            />
            <span className="ml-2">M-Pesa</span>
          </label>
          <label
            className={`inline-flex items-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className={`${
                theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
              } focus:ring-amber-500`}
            />
            <span className="ml-2">Cash</span>
          </label>
        </div>
      </div>

      <div>
        <label
          className={`block text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Special Instructions
        </label>
        <textarea
          value={formData.specialInstructions}
          onChange={(e) =>
            setFormData({ ...formData, specialInstructions: e.target.value })
          }
          rows={3}
          className={`mt-1 block w-full rounded-md ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
              : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
          } shadow-sm`}
          placeholder="Any special requests or instructions"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 border ${
            theme === 'dark'
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          } rounded-md`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 ${
            theme === 'dark'
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-amber-600 hover:bg-amber-700'
          } text-white rounded-md flex items-center`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>{order ? 'Update Order' : 'Create Order'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
