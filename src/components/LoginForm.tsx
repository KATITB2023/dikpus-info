import { FormControl, FormLabel, Input, Button, Flex } from '@chakra-ui/react'

export default function LoginForm() {
    
    return (
        <form>
            <FormControl my={6}>
                <FormLabel>email</FormLabel>
                <Input/>
            </FormControl>
            <FormControl my={6}>
                <FormLabel>password</FormLabel>
                <Input/>
            </FormControl>
            <Flex justify='center'>
                <Button colorScheme="teal" type="submit" my={4}>
                    Submit
                </Button>
            </Flex>
        </form>
    );
  }
  