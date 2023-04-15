package com.example.ethglobal

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView

class ActivitiesListAdapter(
    private val onClick: (Int) -> Unit
) : ListAdapter<String, ActivitiesListAdapter.ActivityViewHolder>(DiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ActivityViewHolder {
        val view = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.item_activity, parent, false)
        view.setOnClickListener {
            onClick(it.tag as Int)
        }
        return ActivityViewHolder(view)
    }

    override fun onBindViewHolder(holder: ActivityViewHolder, position: Int) {
        val activity = getItem(position)
        holder.name.text = activity
        holder.itemView.tag = position
    }

    class ActivityViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        val name: TextView

        init {
            name = itemView.findViewById(R.id.name)
        }
    }

    object DiffCallback : DiffUtil.ItemCallback<String>() {
        override fun areItemsTheSame(oldItem: String, newItem: String): Boolean {
            return oldItem == newItem
        }

        override fun areContentsTheSame(oldItem: String, newItem: String): Boolean {
            return oldItem == newItem
        }
    }
}

data class Activity(
    val id: String,
    val name: String,
    val price: String
)