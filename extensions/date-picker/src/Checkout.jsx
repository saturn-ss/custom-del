import {
  useState, useCallback, useMemo
} from "react";

import {
  Heading,
  DatePicker,
  reactExtension,
  Text, 
  useApplyMetafieldsChange
} from "@shopify/ui-extensions-react/checkout";

reactExtension('purchase.checkout.shipping-option-list.render-after', () => <Extension />);

export default function Extension() {
  const [selectedDate, setSelectedDate] = useState("");
  const [yesterday, setYesterday] = useState("");

  const metafieldNamespace = 'deiliverydate'; // Fixed typo
  const metafieldKey = 'deliveryschedule';

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Sets the selected date to today. If today is Sunday, it sets the date to tomorrow.
  useMemo(() => {
    let today = new Date();

    const yesterday1 = new Date(today);
    yesterday1.setDate(today.getDate() - 1); // Use getDate() to avoid modifying today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Use getDate() to avoid modifying today

    const deliveryDate = today.getDay() === 0 ? tomorrow : today;

    setSelectedDate(formatDate(deliveryDate));
    setYesterday(formatDate(yesterday1));
  }, []);

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Set a function to handle the Date Picker component's onChange event
  const handleChangeDate = useCallback((selectedDate) => {
    setSelectedDate(selectedDate);
    // Apply the change to the metafield
    applyMetafieldsChange({
      type: 'updateMetafield',
      namespace: metafieldNamespace, // Fixed typo
      key: metafieldKey,
      valueType: 'string',
      value: selectedDate,
    });
  }, []);

  return (
    <>
      <Heading level="2">Select a date for delivery</Heading>
      <DatePicker
        selected={selectedDate}
        onChange={handleChangeDate}
        disabled={['Sunday', { end: yesterday }]}
      />
      {/* <Text>{ yesterday }, </Text>
      <Text>{ selectedDate }</Text> */}
    </>
  )
}