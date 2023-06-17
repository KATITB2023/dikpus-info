import { FormControl, FormLabel, FormErrorMessage, Input, Button, Flex } from '@chakra-ui/react'

export default function ChangePasswordForm() {
    return (
        <form>
            <FormControl mb={6}>
                <FormLabel>Current Password</FormLabel>
                <Input/>
            </FormControl>
            <FormControl my={6}>
                <FormLabel>New Password</FormLabel>
                <Input/>
            </FormControl>
            <FormControl my={6}>
                <FormLabel>New Password Confirmation</FormLabel>
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