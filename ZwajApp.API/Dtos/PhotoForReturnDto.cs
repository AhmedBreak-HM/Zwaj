using System;

namespace ZwajApp.API.Dtos
{
    public class PhotoForReturnDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsMain { get; set; }
        public string CloudinaryId { get; set; }
    }
}