import { VStack, Text, HStack, Button, Image, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";

const datas = [
  "Has List Price",
  "Has Open Offer",
  "Owned By Creator",
  "Has Sold",
  "Reserverd Price",
];

const Filter = () => {
  const [selected, setSelected] = useState<string[]>(["Has List Price", "Owned By Creator"]);

  const onSelect = useCallback((s) => {
    const index = selected.indexOf(s);
    if (index > -1) {
      const cop = selected.splice(index, 1);
      setSelected(cop)
    } else {
      setSelected([...selected, s]);
    }
  }, [selected]);

  return (
    <VStack w="full" alignItems="flex-start" my="40px">
      <Text variant="dmSan" my="16px">Filter By:</Text>
      <Stack direction={{base: 'column', lg: 'row'}}   scaleX="16px">
        {datas.map((s) => {
          const isSelected = selected.indexOf(s) > -1 ;
          return (
            <Button variant={isSelected ? "primary" : 'outline'} key={s} onClick={() => onSelect(s)}>
              {s}
              {isSelected && <Image src="/check.svg" alt="check" ml="10px" />}
            </Button>
          );
        })}
      </Stack>
    </VStack>
  );
};

export default Filter;
