using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; } 

        [StringLength(8,MinimumLength=4,ErrorMessage="يجب الا تقل كلمة السر عن 4 ولاتزيد عن 8")]
        public string PassWord { get; set; }
    }
}