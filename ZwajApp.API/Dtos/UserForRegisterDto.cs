using System;
using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [StringLength(8, MinimumLength = 4, ErrorMessage = "يجب الا تقل كلمة السر عن 4 ولاتزيد عن 8")]
        [Required]
        public string PassWord { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string KnownAs { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }
        
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public UserForRegisterDto()
        {
            this.Created = DateTime.Now;
            this.LastActive = DateTime.Now;
        }

    }
}