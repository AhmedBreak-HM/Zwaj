using System;
using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Dtos
{
    public class PhotoForCreateDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CloudinaryId { get; set; }
        public PhotoForCreateDto()
        {
            CreatedAt = DateTime.Now;
        }

    }
}