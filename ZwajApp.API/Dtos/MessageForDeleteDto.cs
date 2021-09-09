namespace ZwajApp.API.Dtos
{
    public class MessageForDeleteDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }

    }
}