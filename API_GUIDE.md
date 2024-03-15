# API DEVELOPEER GUIDE

## .ENV CONFIG

Có hai option cho chức năng làm bài test bằng survey.

- Làm full bộ đề 4 kĩ năng

  - Khi lấy danh sách câu hỏi của một bài test sẽ lấy toàn bộ câu hỏi.

- Làm 2 bài Listening và Speaking

  - Khi lấy danh sách câu hỏi của một bài test chỉ lấy các câu hỏi của một section mà section đó chứa một trong hai loại câu hỏi dạng `audio` hoặc `recording`

Hai dạng này được cấu hình trong file `.env` với Key như sau

> `IS_LS_TEST=false` đối với option 1

> `IS_LS_TEST=true` đối với option 2

> Mặc định sẽ chọn option 1, sau đây sẽ chỉ giải thích các route cho option 2.

## HOW TO USE

### `auth/email/login`

> Route này dùng cho việc đăng nhập vào hệ thống. Thông tin các tham số xem ở mục api docs.

Khi người dùng đăng nhập thành công, server sẽ trả về một `token` và một `refresh_token`.

- `token` : Dùng để xác thực người dùng cho các route khác sau khi đăng nhập mà không cần đăng nhập lại. `token` có thời hạn sử dụng, mặc định là 15 phút.

- `refresh_token` : Dùng để lấy `token` mới khi mà `token` hiện tại hết hiệu lực. `refresh_token` cũng có thời hạn, mặc định là 1 năm (ok có thể chỉnh trong env).

<b> <i>Yêu cầu:</i> Lưu hai token này vào trong cookie và khi `token` hết hạn, trước khi bắt người dùng đăng nhập lại thì hãy thử refresh token cũ trước. </b>

### `survey/me?page={number}`

> Liệt kê tất cả các bài test thuộc sở hữu của người dùng (buộc phải đăng nhập)

Như vậy, khi vào giao diện trang chủ sau khi đăng nhập và có được `token`, người dùng bấm vào nút (ở đâu đó tùy FE) để xem thông tin các bài test đã, đang diễn ra.

Trong đó, theo flow của mình là người dùng làm bài test reading & writing trên odoo trước sau đó đăng nhập vào app mới (cái của mình-nestjs) để làm tiếp tục phần listening và speaking thì route này sẽ trả về mỗi một bài test sẽ có các tham số riêng và hai thứ quan trọng là `survey.access_token` (1) và `access_token` (2)

Tham số query `page` (page >= 1) dùng để phân trang nếu trường hợp danh sách quá dài, mặc định mỗi trang sẽ chứa tối đa 10 records (có thể config trong `.env`).

```
> Sau đây, để phù hợp với cách gọi của odoo, ta quy ước: survey.access_token (1) là access_token, access_token (2) là answer_token
```

### `survey/{access_token}`

> Hiện thông tin về survey có `access_token` và bộ câu hỏi kèm theo câu trả lời gợi ý nếu có (dạng bài matrix, multiple choice, simple choice...)

### `survey/start/{acess_token}?answerToken={answer_token}`

> Bắt đầu làm bài. Nếu answerToken không có thì tạo mới một bài làm. Ngược lại, nếu có thì trả về thông tin của bài làm đó mà không làm gì thêm.

> > Đối với option 2, nếu vào route này sẽ bắt buộc cả hai tham số, nếu thiếu tham số `answerToken` thì sẽ không tạo mới mà sẽ báo lỗi. Ngược lại, bài làm ứng với `answer_token` sẽ bắt đầu tính thời gian cho phần làm bài listening và speaking.

Lưu ý, bài test listening và speaking chỉ có thể start một lần duy nhất, điều này có nghĩa là FE cần render một bộ đề bao gồm cả hai kĩ năng trên trên cùng một giao diện làm bài. Không thể submit bài listening lên server rồi lại submit speaking lên server được.

### `survey/submit/{access_token}/{answer_token}`

> Bài làm chuyển sang chế độ nộp bài. Hệ thống sẽ tự cộng thêm một khoảng thời gian n phút (mặc định n = 1) để sau khi thời gian giới hạn đã kết thúc thì người dùng sẽ có thời gian nộp bài. Nếu bài làm nộp quá thời gian, vẫn cho nộp thành công nhưng các câu trả lời sẽ bị tính là `skipped` (bỏ qua đáp án)

<hr>

Các dạng data hợp lệ cho việc submitting bài test có dạng:

```
export class SurveyPostParamsDto {
  answers: Map<number, SurveyPostUserAnswerDto>;
}
```

- `answers` là một key-value-pair chứa `key` là mã id của câu hỏi, `value` chứa đáp án câu hỏi.

```
const post = {
  answers: {
    11: {
      value: 22, // simple choice
    },
    13: {
      value: [29, 31], // muiltiple choice
    },
    15: {
      value: "Ok, it's good", // char_box, text, recording...?
    },
    16: {
      value: new Date(), // datetime value
    },
    17: {
      value: [{row: 103, col: 34}, {row: 32, col : 55}] // matrix answer
    },
  },
}
```
