using System;

namespace ZwajApp.API.Dtos
{
    public class MessgeForCreationDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }
        public MessgeForCreationDto()
        {
            MessageSent = DateTime.Now;
        }

    }
}