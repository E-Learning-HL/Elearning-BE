import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"

class Course{
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    courseId : number
}
export class CreatePaymentDto {
    @ApiProperty()
    @IsNumber()
    amount : number

    @ApiProperty()
    @IsNotEmpty()
    paymentMethodId : number

    @ApiProperty({
        type: [Course]
    })
    @IsNotEmpty()
    course : Course[]
}





class PaymentDetail{
    @ApiProperty({
        type: [CreatePaymentDto]
    })
    @IsNotEmpty()
    payment : CreatePaymentDto

}

